<p align="center">
  <img src=https://cdn.iconscout.com/icon/free/png-256/starwars-225970.png width="320" alt="Star Wars Api" /></a>
</p>

## Description

Api that maintains star wars characters, it supports CRUD operations send over http protocol.

Working demo available [here](https://pepper-star-wars-api.herokuapp.com/swagger/)

## Installation

```bash
$ yarn install
```

## Running the app locally
Before running ensure that mongodb instance is running on your local machine on port 27017 ( can be changed in the config file /config/local.js)

```bash
# development
$ yarn start:dev

# production
$ yarn start
```

## Running the app locally via docker
Requires docker-machine and docker-compose to be pre-installed on your local machine 

```bash
$ docker-compose up
```

## Test

```bash
$ yarn test
```
