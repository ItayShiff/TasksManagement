local JSONConvertor = require('cjson')
local utils = require("utils")
local uuid = require("uuid")
local socket = require("socket")
uuid.randomseed(socket.gettime()*10000)

local db = {}

function db.connect()
  local driver = require("luasql.mysql")
  local env = driver.mysql()
  return env:connect("todoDatabase", "itay", "asdASD123!@#", "127.0.0.1") -- Must have 127.0.0.1 as param to connect to localhost from lapis server & docker
end


db.conn = db.connect();

-- if not conn then
--   print("Error!", err)
-- end

-- print(conn)
-- local cursor = (conn:execute("SELECT * FROM mytable"))
-- conn:execute("INSERT INTO users (name, email) VALUES ('John Doe', 'johndoe@example.com')");

-- Generic function to query tasks, if not given param should_not_convertToJson, so we convert to JSON by default
local function QueryTasks(query, should_not_convertToJson)
  local cursor = db.conn:execute(query)
  local row = cursor:fetch ({}, "a")	-- the rows will be indexed by field names
  -- print(cursor)
  local result = {};
  
  while row do  -- Scan for next rows if existing
    -- print(row.user_id,row.id,row.title,row.description,row.completed)

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

  if should_not_convertToJson then
    return result
  end
    
  return JSONConvertor.encode(result)
end


function db.GetAllTasks(should_not_convertToJson) 
  local query = "SELECT * FROM Tasks"
  return QueryTasks(query, should_not_convertToJson)
end


function db.GetSpecificTask(task_id, should_not_convertToJson)
  local query = string.format("SELECT * FROM Tasks where id='%s'", task_id)
  return QueryTasks(query, should_not_convertToJson)
end


function db.GetAllTasksOfSpecificUserID(user_id, should_not_convertToJson)
  local query = string.format("SELECT * FROM Tasks where user_id='%s'", user_id)
  return QueryTasks(query, should_not_convertToJson)
end


function db.UpdateSpecificTask(user_id, task_id, newTitle, newDescription, newCompleted)
  local query = string.format("UPDATE Tasks SET title='%s', description='%s', completed=%d where id='%s'", newTitle, newDescription, newCompleted, task_id)
  -- local status, err = db.conn:execute(query)
  db.conn:execute(query)
end

function db.InsertNewTask(user_id, title, description, completed)
  local new_task_id = uuid()

  print(new_task_id)

  local newCompletedValue = 1
  if (completed == "false") then
    newCompletedValue = 0
  end
  
  local query = string.format("INSERT INTO Tasks VALUES ('%s', '%s', '%s', '%s', '%d')",
                 user_id, new_task_id, title, description, newCompletedValue)
  -- -- local status, err = db.conn:execute(query)
  db.conn:execute(query)
end

function db.DeleteSpecificTask(task_id)
  local query = string.format("DELETE FROM Tasks where id='%s'", task_id)
  -- local status, err = db.conn:execute(query)
  db.conn:execute(query)
end

return db

