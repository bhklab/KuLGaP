# KuLGaP
KuLGap is a web application that allows users to calculate KuLGaP as well as several other measurements of response to anti-tumour therapy.

## Setup Instructions

- Clone the repo
  
```bash
git clone git@github.com:bhklab/KuLGaP.git
cd KuLGap
```

- In the project directory, install all the server dependencies using `pip install -r requirements.txt
- To start the server run this command `flask run`
- Start the client (development mode) by running `npm start`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- React
- React-Router
- Express
- Knex
- Body-parser

## Dev Dependenices

- Nodemon
- Eslint

## Build Instructions

### `cd client && npm build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Server
- Production Server: [http://kulgap.ca](http://kulgap.ca)
