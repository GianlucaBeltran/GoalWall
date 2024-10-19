# GoalWall
(DM2601) Repository for Group 16 prototype

## Main frameworks used
[Express](https://www.npmjs.com/package/express) and [socket.io](https://www.npmjs.com/package/socket.io) for the api (gw-api).

[React](https://react.dev/) for the screen (gw-screen).

[React native](https://reactnative.dev/) and [Expo](https://docs.expo.dev/) for the app (gw-app).

Most of the code is in [typescript](https://www.typescriptlang.org/) to ensure a better developing experience

## Project Structure

This is a mono-repo which means all the code of our prototype is stored in this single repository. The project is divided in three parts.

### API (gw-api)

The api is what connects all the different apps and gives them the information they need.

Since this is a prototype there is no database and no user authentication, all the information is being written into five json files stored in the data directory.
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







