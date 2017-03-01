[![Build Status](https://travis-ci.org/gonebusy/sample-react-app.svg?branch=master)](https://travis-ci.org/gonebusy/sample-react-app)

--

# Gonebusy Sample React App

This is a sample React app that demonstrates how to incorporate the [gonebusy-nodejs-sdk](https://github.com/gonebusy/gonebusy-nodejs-client) into a smooth UX for booking.

## Prerequisites

* Node 5, Node 6
* [Signup](https://beta.gonebusy.com/login) with Gonebusy and obtain your API token.

## Getting Started

```
$ git clone git@github.com:<your_fork>/sample-react-app.git
$ cd sample-react-app
$ npm install
```

## Run a local dev environment
Start a local server running on port 8080, at **http://localhost:8080**. Bundles js and css via webpack with hot reload.

```
$ npm start
```

## Build Static files for deployment to CDN/hosting
Minifies js and css. 

```
$ npm run build
```

## Run a local server serving Static files
Minifies js and css and starts server at **http://localhost:4000**

```
$ npm run static
```
