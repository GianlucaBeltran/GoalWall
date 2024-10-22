#!/bin/bash
echo "Initalizing app"

cd gw-app

echo "Installing npm packages"
npm install

echo "Getting local ip to talk to the api"
LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')

touch .env

echo "EXPO_PUBLIC_HOME_API=http://$LOCAL_IP:3000" > .env

echo "Starting app"
npx expo start
