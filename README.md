# PresenceBoard

This project is a React app, along with NodeJS and MongoDB database. The project is also deployed to Heroku. <br />
The app is allowing to the company to monitor the live status of its employees presence in the office. <br />
The employees can check the monitor to see who is presence and who is OOO <br />
The employees can update their entry and leaving with their own NFC chip that is programmed for them when added to the database by the operator. <br />

to run this project locally:

1. run 'npm i' on both frontend and backend folders
2. on the frontend folder: run 'npm run start-dev'
3. on the backend folder: run 'npm run server:dev'
4. go to http://localhost:3000/
5. Login credentials for demo: Company: Bat-Yam, Password: 123
To update the presence status, you can use the URL provided by the website (Copy NFC LINK - in Company Profile page, or Employee Info popup) directly, <br />
or you can encode an NFC chip that directs to this URL.

You can also visit the Heroku app at https://presence-board-echo.herokuapp.com/#/ <br/>
(Please allow a few seconds for the server to start)


***
### Technologies / Framework:

-   Framework: ReactJs
-   Server: NodeJs
-   Database: MongoDB
-   SocketIO for on-Demand websocket
-   MaterialUI for styled elements

This app is deployed automatically to Heroku when PR is being merged to main by Gihtub Actions
