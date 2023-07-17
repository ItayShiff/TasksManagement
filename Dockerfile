FROM ubuntu:22.04

RUN apt-get update \
    && apt-get upgrade \
    && apt-get install -y libreadline-dev

# Install NVM && Node.js LTS
# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget \
        unzip \
        gnupg \
        lsb-core \
        libmysqlclient-dev \
        mysql-server \
    && rm -rf /var/lib/apt/lists/*



SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash \
    && source ~/.profile \
    && nvm install --lts
# RUN nvm -v
# SHELL ["/bin/bash", "--login", "-c"]


# Install Lua 5.1.5
# SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN wget https://www.lua.org/ftp/lua-5.1.5.tar.gz \
    && tar zxpf lua-5.1.5.tar.gz \
    && cd lua-5.1.5 && make linux && make install

# Install Luarocks
RUN wget https://luarocks.org/releases/luarocks-3.9.2.tar.gz \
    && tar zxpf luarocks-3.9.2.tar.gz \
    && cd luarocks-3.9.2 && ./configure && make && make install \
    && luarocks install luasocket


# Install OpenResty
RUN wget -O - https://openresty.org/package/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/openresty.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/ubuntu $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/openresty.list > /dev/null \
    && apt-get update \
    && apt-get -y install openresty

# Lapis
RUN luarocks install lapis 

# For encoding & decoding json
RUN luarocks install lua-cjson

# For JWT
# RUN luarocks install luajwtjitsi

# uuid for MySQL new insertions
RUN luarocks install uuid

# LuaSQL MySQL
RUN luarocks install luasql-mysql MYSQL_INCDIR=/usr/include/mysql

# Starting MySQL Service, granting permissiong to itay@localhost with password asdASD123!@#, loading database "todoDatabase"
ADD loadDatabase.sh /tmp/loadDatabase.sh
ENTRYPOINT ["sh", "/tmp/loadDatabase.sh"] 

WORKDIR /app
COPY . .
# RUN npm install
# RUN npm run build
# CMD ["npm", "run", "dev"]
