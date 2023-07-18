
local jwt = require("luajwtjitsi")
local secret_token = "6e11ff524a46e5a4f30f9a7b12d2dfa3bc57cd2c27ef03b55"
local alg = "HS256" -- (default alg for JWT)
local db = require("dbFile")

local auth = {}

-- Generating JWT token
function auth.signIn(_username, _password)
    local userData = {
        username = _username,
        password = _password
    }

    local token, err = jwt.encode(userData, secret_token, alg)
    return token
end


function auth.validateUser(token)
    if token == nil then
        return false
    end

    local decoded, err = jwt.verify(token, alg, secret_token)

    -- Validating decoded data with database
    if decoded == nil or db.isUserDataValid(token.username, token.password) then
        return false
    end

    return true
end

function auth.getUsernameFromToken(token)
    if not auth.validateUser(token) then
        return nil
    else
        local decoded, err = jwt.verify(token, alg, secret_token)
        return decoded.username
    end
end

return auth