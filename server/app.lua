local lapis = require("lapis")
local app = lapis.Application()
local db = require("dbFile")
local auth = require("auth")
local utils = require("utils")
local JSONConvertor = require('cjson')
local app_helpers = require("lapis.application")

local json_params = require("lapis.application").json_params
local before_filter = require("lapis.application").before_filter

local capture_errors, yield_error = app_helpers.capture_errors, app_helpers.yield_error


app:before_filter(function(self)
  self.res.headers["Content-Type"] = "application/json"
  self.res.headers["Access-Control-Allow-Origin"] = "*" -- So that we can access it from localhost:3000 in Front End (Avoid CORS)
end)


-- Retrieve all tasks or all tasks for specific user if optional query parameter used
app:get("/tasks", function(self)
  local result = nil
  if self.params.userId then          
    result = db.GetAllTasksOfSpecificUserID(self.params.userId)
  else
    result = db.GetAllTasks()
  end

  return { json = result, status = 200 }
end)

-- Retrieve a specific task
app:get("/task/:id", function(self)
  return {
    json = db.GetSpecificTask(self.params.id),
    status = 200
  }
end)

-- Update a specific task
app:put("/task/:id", function(self)
  -- Validating user's token
  if self.params.token == nil or not auth.validateUser(self.params.token) then
    print("Not authenticated")
    return ("Not authenticated")
  end

  local task_to_be_updated = db.GetSpecificTask(self.params.id, utils.DONT_DO_JSON)

  -- Making sure the task exists before we update it, if it's length is 0 so it doesn't exist
  if #task_to_be_updated == 0 then 
    return "{}"
  end
  
  -- Make sure it is the the owner of the task TODO !!!!!
  if self.params.user_id == nil or task_to_be_updated[1].user_id ~= self.params.user_id then
    return "NOT ALLOWED"
  end
 
  -- Using optional chaining to override only the new values and preserving old ones
  db.UpdateSpecificTask(self.params.user_id,
                        self.params.id,
                        utils.OptionalChaining(self.params.title, task_to_be_updated[1].title),
                        utils.OptionalChaining(self.params.description, task_to_be_updated[1].description),
                        utils.OptionalChaining(self.params.completed, task_to_be_updated[1].completed))

  -- -- TODO HERE!!!!
  return "success"
end)

app:delete("/task/:id", function(self)
  -- Validating user's token
  if self.params.token == nil or not auth.validateUser(self.params.token) then
    print("Not authenticated")
    return ("Not authenticated")
  end

  db.DeleteSpecificTask(self.params.id)
  return "good"
end)


-- Create a new task, here accepting additional parameter as userId, make sure
app:post("/task", capture_errors(function(self)
  -- Validating user's token
  if self.params.token == nil or not auth.validateUser(self.params.token) then
    print("Not authenticated")
    return ("Not authenticated")
  end

  if (self.params.userId == nil) then
    print("Missing usedId parameter")
  end

  -- Make sure we achieved 
  -- Verify the user with jwt !!!!!!!!!!!

  if (self.params.title == nil or self.params.description == nil or self.params.completed == nil) then
    -- throw error
    -- print("BAD!!")
    yield_error("BADDDDDD")
    return
  end


  db.InsertNewTask(self.params.userId, self.params.title, self.params.description, self.params.completed)
  return "good"
end))


-- Create new user
app:post("/users", capture_errors(function(self)
  if (self.params.username == nil or self.params.password == nil) then
    -- throw error
    yield_error("missing information, username or password")
    return ("missing information, username or password")
  end
  
  if db.isUsernameTaken(self.params.username) then
    yield_error("username is taken")
    return ("username is taken")
  end

  return db.signUp(self.params.username, self.params.password)
end))


app:post("/auth", capture_errors(function(self)
  if (self.params.username == nil or self.params.password == nil) then
    -- throw error
    yield_error("missing information, username or password")
    return ("missing information, username or password")
  end

  if not db.isUserDataValid(self.params.username, self.params.password) then
    yield_error("wrong username or password given")
    return ("wrong username or password given")
  end
  
  return auth.signIn(self.params.username, self.params.password)
end))


return app
