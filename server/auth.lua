
local jwt = require("luajwtjitsi")
local secret_token = "6e11ff524a46e5a4f30f9a7b12d2dfa3bc57cd2c27ef03b55"
local alg = "HS256" -- (default alg for JWT)
local JSONConvertor = require('cjson')

local auth = {}

-- Generating JWT token
function auth.signIn(_username, _password)
    local userData = {
        username = _username,
        password = _password
    }

    local _token, err = jwt.encode(userData, secret_token, alg)

    return JSONConvertor.encode({
        token = _token
    })
end

function auth.validateUser(token)
    local decoded, err = jwt.verify(token, alg, secret_token)
    if decoded == nil then
        return false
    end

    return true
end

return auth