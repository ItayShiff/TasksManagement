local utils = {}

-- Basically implementing the idea behind ?. from javascript, return the first if existing 
function utils.OptionalChaining(value_1, value_2)
    if value_1 then
        return value_1
    end

    return value_2
end

return utils