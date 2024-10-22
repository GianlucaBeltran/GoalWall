# GoalWall
(DM2601) Repository for Group 16 prototype

https://github.com/user-attachments/assets/9340685d-fe2e-45a6-990c-8410febd382a

## Figma

If you have any trouble setting up the project locally, here is the [interactive figma of our app](https://www.figma.com/proto/Z5SXOFlx63xZpssat342Jn/Media-Technology?page-id=504%3A1585&node-id=504-1678&node-type=canvas&viewport=572%2C688%2C0.26&t=o6S7FVwMlo0Jcu7q-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=504%3A1678) and [figma of the screen](https://www.figma.com/proto/Z5SXOFlx63xZpssat342Jn/Media-Technology?page-id=0%3A1&node-id=91-117&node-type=frame&viewport=-48%2C60%2C0.06&t=Fh2HSxamGc1WGtRz-1&scaling=contain&content-scaling=fixed&starting-point-node-id=110%3A931)

## Running locally

These instructions are made with mac in mind as stated in the assigment instructions.

Before running, ensure that [Node.js is installed](https://nodejs.org/en/download/package-manager) in the computer. Node.js 0.10 or higher is required.

### Cloning the repo
1. Open the terminal
2. Clone the repository in whichever folder you choose: `git clone https://github.com/GianlucaBeltran/GoalWall.git` using https or `git@github.com:GianlucaBeltran/GoalWall.git` using ssh.
3. Once cloned, cd into the Goal Wall directory: `cd GoalWall`

> **_NOTE:_** Open a new terminal or terminal tab after running each project

### Running the api (gw-api)
1. Run: `bash ./apiRunCommand.sh` to start the api
2. The terminal should have printed: `Express is listening at http://localhost:3000`
> **_IMPORTANT:_** Do not close the terminal tab, it will shut down the server, the server needs to be up for the app and the goal screen to fetch all the information they need

### Running the app (gw-app)
> **_NOTE:_** The app was developed mainly for iphone, very little to no testing was done on android devices
1. Install [Expo go](https://expo.dev/go) on your mobile device
2. Create an account in Expo go
3. Run: `bash ./appRunCommand.sh` to start the app
4. The terminal should have printed a QR code, scan it with your phone camera, expo go should open and load the app
> **_NOTE:_** If the app crashes for some reason, or a red error message is displayed, you can press r in the terminal running expo go, to reload the app

### Running the screen (gw-screen)
> **_NOTE:_** The screen was developed using chrome. No testing has been done in other browsers. This shouldn't be an issue, but it is good to keep in mind.
1. Run: `bash ./screenRunCommand.sh`
2. A browser tab should open and the goals should start animating on screen
> **_EASTER EGGS:_** There is some interaction to be had with the screen, although it's main purpose is to just visualize the goals. Check the Screen section for more information.

## Main frameworks used
[Express](https://www.npmjs.com/package/express) and [socket.io](https://www.npmjs.com/package/socket.io) for the api (gw-api).

[React](https://react.dev/) for the screen (gw-screen).

[React native](https://reactnative.dev/) and [Expo](https://docs.expo.dev/) for the app (gw-app).

Most of the code is in [typescript](https://www.typescriptlang.org/) to ensure a better developing experience

## Project Structure

This is a mono-repo which means all the code of our prototype is stored in this single repository. The project is divided in three parts.

### API (gw-api)

The api is what connects all the different apps and gives them the information they need.

Since this is a prototype there is no database and no user authentication, all the information is being written into four json files stored in the data directory.
Due to do this, 5 classes were made to try and keep the information handling cleaner.

 - Users
 - Goals
 - Comments
 - Chats
 - Reaction

Every time a json is read, a class is instantied and all the data is handled through methods of the class and then written back to json, keeping the data manipulation centered in one place for each json. 

It is built using express for all of the REST requests, so get, post and delete. 
It is subdivided in 5 parts to try to keep the code clean.

 - /user (fetching and writing all data related to the user)
    - /user/avatar (this route is being used to fetch images from the api, thanks to caching, image fetching from the app is quicker than staticly storing images on it)
 - /goal (fetching and writing all data related to goals)
 - /comment (fetching and writing all data related to comments)
 - /chats (fetching and writing all data related to chats and messaging)
 - /reactions (fetching and writing all data related to reactions)

For messaging and talking to the goal screen socket.io is being used. Every time a user logs in using their name and last name, a socket is created for them, this allows users to chat with each other and it allows the screen to know when a new goal is created, edited or deleted, enabling it to display the goals in real time.

### App (gw-app)

This is the main focus of the code. The app was built using React native and Expo. Expo allowed us to run the app using a tunnel which means people from different networks can still download and use the app by downloading expo go on their devices. This was specially usefull for user testing, since everyone could test independently without the need of running the server locally. 

There is a lot to go over with the app, so in summary, it is built using mainly Stacks for screen navigation and all the images are being fetched from the api like previously stated. 

### Screen (gw-screen)

This is the goall screen, our main way of displayig everyones goals. It is built using React and the animations are done using the [Framer motion library](https://www.npmjs.com/package/framer-motion). This is the most basic code of the project since it just handles data visualisation, there is little interaction. There are little easter eggs that a user could do though.

 - Pressing f to enter and exit fullscreen (known bug here: if you enter fullscreen by pressing f and then exit fullscreen by pressing esc, instead of f, an error message will appear on screen, it can be safely dismissed and everything will work again, if it doesnt a quick refresh of the page should fix all problems)
 - Pressing s to shuffle the goals and display them in random order
 - Presing 0-4 to clear each row of goals individually
 - Pressing + and - to speed up or slow down the animation speed of the goals (this is pretty buggy at the moment so press at your own risk)







