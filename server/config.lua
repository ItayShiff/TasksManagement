local config = require("lapis.config")

config("development", {
  server = "nginx",
  code_cache = "on",
  num_workers = "1"
})
