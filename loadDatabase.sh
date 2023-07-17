#!/bin/bash
service mysql start

# mysql -u root -e "SHOW DATABASES;"
mysql -u root -e "CREATE USER 'itay'@'localhost' IDENTIFIED BY 'asdASD123!@#';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO 'itay'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
mysql -u root -e "CREATE DATABASE todoDatabase;"
mysql -u itay -pasdASD123!@# todoDatabase < /app/server/luasql.sql;  # Importing


# npm run dev-server
/bin/bash