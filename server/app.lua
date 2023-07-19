local lapis = require("lapis")
local app = lapis.Application()
local db = require("dbController")
local auth = require("auth")
local utils = require("utils")
local app_helpers = require("lapis.application")

local json_params = require("lapis.application").json_params
local before_filter = require("lapis.application").before_filter

local capture_errors, yield_error = app_helpers.capture_errors, app_helpers.yield_error


app:before_filter(function(self)
  self.res.headers["Content-Type"] = "application/json"
  -- self.res.headers["Access-Control-Allow-Origin"] = "*" -- Added in nginx.conf so that we can access it from localhost:3000 in Front End (Avoid CORS)
end)


-- Retrieve all tasks or all tasks for specific user if optional query parameter used
app:get("/tasks", json_params(function(self)
  local result = nil
  if self.params.userId then          
    result = db.GetAllTasksOfSpecificUserID(self.params.userId)
  else
    result = db.GetAllTasks()
  end

  return { json = result, status = 200 }
end))


-- Retrieve a specific task
app:get("/task/:id", function(self)
  return { json = db.GetSpecificTask(self.params.id), status = 200 }
end)


-- Update a specific task
app:put("/task/:id", json_params(function(self)
  if not auth.validateUser(self.params.token) then
    return { json = { message = "Not authenticated"}, status = 401 }
  end

  local task_to_be_updated = db.GetSpecificTask(self.params.id)
  
  -- Make sure the task exists before we update it, if it's length is 0 so it doesn't exist
  local doesThisTaskNotExist = #task_to_be_updated == 0
  if doesThisTaskExist then 
    return { json = { message = "There isn't such task"}, status = 404 }
  end
  
  -- Make sure it is the the owner of the task
  if self.params.user_id == nil or task_to_be_updated[1].user_id ~= self.params.user_id then
    return { json = { message = "You're not allowed to edit this task"}, status = 401 }
  end
 
  -- Using optional chaining to override only the new values and preserving old ones
  db.UpdateSpecificTask(self.params.user_id,
                        self.params.id,
                        utils.OptionalChaining(self.params.title, task_to_be_updated[1].title),
                        utils.OptionalChaining(self.params.description, task_to_be_updated[1].description),
                        utils.OptionalChaining(self.params.completed, task_to_be_updated[1].completed))

  return { json = "good", status = 200 }
end))

-- Delete task by id (of task)
app:delete("/task/:id", json_params(function(self)
  if not auth.validateUser(self.params.token) then
    return { json = { message = "Not authenticated"}, status = 401 }
  end

  db.DeleteSpecificTask(self.params.id)
  return { json = "good", status = 200 }
end))


-- Create a new task, here accepting additional parameter as userId
app:post("/task", json_params(function(self)
  if not auth.validateUser(self.params.token) then
    return { json = { message = "Not authenticated"}, status = 401 }
  end

  if (self.params.userId == nil) then
    return { json = { message = "Missing userId parameter"}, status = 422 }
  end


  if (self.params.id == nil or self.params.title == nil or self.params.description == nil or self.params.completed == nil) then
    return { json = { message = "Missing id or title or description or completed parameter"}, status = 422 }
  end


  db.InsertNewTask(self.params.userId, self.params.id, self.params.title, self.params.description, self.params.completed)
  return { json = "good", status = 200 }
end))


-- Create new user
app:post("/users", json_params(function(self)
  if (self.params.username == nil or self.params.password == nil) then
    return { json = { message = "Missing username or password parameter"}, status = 422 }
  end
  
  if db.isUsernameTaken(self.params.username) then
    return { json = { message = "Username is taken already"}, status = 409 }
  end

  db.signUp(self.params.username, self.params.password)
  return { json = "good", status = 200 }
end))


-- Login
app:post("/auth", json_params(function(self)
  if (self.params.username == nil or self.params.password == nil) then
    return { json = { message = "Missing username or password parameter"}, status = 422 }
  end

  if not db.isUserDataValid(self.params.username, self.params.password) then
    return { json = { message = "Wrong username or password given"}, status = 401 }
  end
  
  local token = auth.signIn(self.params.username, self.params.password)
  return { json = token, status = 200 }
end))

app:post("/get-username-from-token", json_params(function(self)
  local username = auth.getUsernameFromToken(self.params.token)

  if username == nil then
    return { json = nil, status = 400 }
  else
    return { json = username, status =  200 }
  end
end))


return app
