# French national assembly words analysis #

This project weekly fetch debats reports of the French National Assembly: `https://www.assemblee-nationale.fr/`.   
Datas are stored and analysed before publications.

# Project description ##

    .
    ├── components          # Methods
    ├── config              # Environment variables
    ├── dist                # Compiled files
    ├── models              # Database models
    ├── src
        ├── controllers     #
        ├── models          #
        └── services        # Reusables methods
    ├── test                # Unit testing
    ├── tmp                 # Location for temporary files
    ├── utils               # Constants
    ├── README.md           # Instructions
    ├── app.ts              # Main file
    ├── package-lock.json   # Packages
    ├── package.json        # Packages and metadatas
    └── tsconfig.json       # Configuration for Typescript

## Technologies used ##

* Node.js
* TypeScript

## Configuration ##

npm `v16.17.0`

## Installation ##

Build project with node   
```bash
npm install
```

## Usage ##

Run app.js with nodemon   
```bash
npm start
```

Test project with Jest
```bash
npm test
```

Compile project with Typescript once  
```bash
npm build
```  

Compile project with Typescript and watch changes 
```bash
npm dev
```
  
## Contributing

- Clément B. - [github](https://github.com/clementbrizard)
- Timothée B. - [github](https://github.com/timotheebeaugas)