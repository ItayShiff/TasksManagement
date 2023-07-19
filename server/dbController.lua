local utils = require("utils")
local socket = require("socket")

db = {}    -- Global variable

function db.connect()
  local driver = require("luasql.mysql")
  local env = driver.mysql()
  return env:connect("todoDatabase", "itay", "asdASD123!@#", "127.0.0.1") -- Must have 127.0.0.1 as param to connect to localhost from lapis server & docker
end


db.conn = db.connect();


-- Generic function to query tasks
local function QueryTasks(query)
  local cursor = db.conn:execute(query)
  local row = cursor:fetch ({}, "a")	-- the rows will be indexed by field names
  local result = {};
  
  while row do  -- Scan for next rows if existing
    table.insert(result, {
      user_id = row.user_id,
      id = row.id,
      title = row.title,
      description = row.description,
      completed = row.completed
    })
    row = cursor:fetch (row, "a")	-- reusing the table of results
  end

  cursor:close()
  return result
end


function db.GetAllTasks() 
  local query = "SELECT * FROM Tasks"
  return QueryTasks(query)
end


function db.GetSpecificTask(task_id)
  local query = string.format("SELECT * FROM Tasks where id='%s'", task_id)
  return QueryTasks(query)
end


function db.GetAllTasksOfSpecificUserID(user_id)
  local query = string.format("SELECT * FROM Tasks where user_id='%s'", user_id)
  return QueryTasks(query)
end


function db.UpdateSpecificTask(user_id, task_id, newTitle, newDescription, newCompleted)
  local query = string.format("UPDATE Tasks SET title='%s', description='%s', completed=%d where id='%s'", newTitle, newDescription, newCompleted, task_id)
  db.conn:execute(query)
end

function db.InsertNewTask(user_id, task_id, title, description, completed)
  local query = string.format("INSERT INTO Tasks VALUES ('%s', '%s', '%s', '%s', '%d')",
                 user_id, task_id, title, description, completed)
  db.conn:execute(query)
end


-- Generic function to query Users
local function QueryUsers(query)
  local cursor = db.conn:execute(query)
  local row = cursor:fetch ({}, "a")	-- the rows will be indexed by field names
  local result = {};
  
  while row do  -- Scan for next rows if existing
    table.insert(result, {
      id = row.id,
      password = row.password
    })
    row = cursor:fetch (row, "a")	-- reusing the table of results
  end

  cursor:close()
  return result
end


function db.DeleteSpecificTask(task_id)
  local query = string.format("DELETE FROM Tasks where id='%s'", task_id)
  db.conn:execute(query)
end


function db.isUsernameTaken(username)
  local query = string.format("SELECT * FROM Users where id='%s'", username)
  local res = QueryUsers(query, utils.DONT_DO_JSON)
  -- If there is such user
  if #res ~= 0 then
    return true
  end

  return false
end


function db.isUserDataValid(username, password)
  local query = string.format("SELECT * FROM Users where id='%s' and password='%s'", username, password)
  local res = QueryUsers(query, utils.DONT_DO_JSON)
  -- If there is such user
  if #res == 1 then
    return true
  end

  return false
end


function db.signUp(username, password)
  -- Add to database
  local query = string.format("INSERT INTO Users VALUES ('%s', '%s')", username, password)
  db.conn:execute(query)
end

return db

