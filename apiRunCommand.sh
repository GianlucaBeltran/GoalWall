#!/bin/bash
echo "Initalizing api server"

cd gw-api

echo "Installing npm packages"
npm install

echo "Starting app"
npm run dev
