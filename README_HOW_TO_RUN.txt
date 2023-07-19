Run these 2 commands in terminal one after another:
docker run -p 3000:3000 -p 8080:8080 -it itayshiff/task-app:latest
npm run server & (npm run build && npm run prod-client)



Then wait until the build completes and runs - until you see:

> TasksManagement@1.0.0 prod-client
> next start

- ready started server on 0.0.0.0:3000, url: http://localhost:3000



Then you can access http://localhost:3000 and start browsing the task management site