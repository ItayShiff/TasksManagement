local lapis = require("lapis")
local app = lapis.Application()
local db = require("dbFile")
local utils = require("utils")
local JSONConvertor = require('cjson')
local respond_to = require("lapis.application").respond_to
local app_helpers = require("lapis.application")

local capture_errors, yield_error = app_helpers.capture_errors, app_helpers.yield_error

-- Retrieve all tasks or all tasks for specific user if optional query parameter used
app:get("/tasks", function(self)
  -- Optional query parameter userId
  if self.params.userId then
    return db.GetAllTasksOfSpecificUserID(self.params.userId)
  end

  return db.GetAllTasks()
end)

-- Retrieve a specific task
app:get("/task/:id", function(self)
  -- Verify the user with jwt !!!!!!!!!!!
  return db.GetSpecificTask(self.params.id)
end)

-- Update a specific task
app:put("/task/:id", function(self)
  -- Verify the user with jwt !!!!!!!!!!!

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
  -- Verify the user with jwt !!!!!!!!!!!
  db.DeleteSpecificTask(self.params.id)
  return "good"
end)


-- Create a new task, here accepting additional parameter as userId, make sure
app:post("/task", capture_errors(function(self)
  -- return ("POST SPECIFIC TASK")
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
    -- print("BAD!!")
    yield_error("BADDDDDD")
    return
  end

  db.signUp(self.params.username, self.params.password)
end))

return app
