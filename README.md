# Goose Track manager

---

## Description

[API documentation](https://goose-track-verq.onrender.com/api-docs/)

_This is a Backend part which provides on managing tasks and time management. The backend is developed using Node.js, Express, TypeScript, MongoDB, Mongoose, Cloudinary, and Google Authentication. The project consists of three main models: Auth, Tasks, and Reviews.._

---

## Table of Contents

- [Documentation](#documentation)
- [Technologies Used](#technologies)
- [Installation](#installation)

---

## Documentation <a id="documentation"></a>

The API endpoints are documented using OpenAPI specification (formerly known as Swagger). You can access the [API documentation](https://goose-track-verq.onrender.com/api-docs/) by running the server locally and visiting the provided link.

---

## Technologies Used <a id="technologies"></a>

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Cloudinary
- Google Auth
- Joi
- Swagger

---

## Installation <a id="installation"></a>

- Clone the project repository.

```
$ git clone https://github.com/Siryi-Oleksandr/goose-track-backend.git
$ cd your-project
```

- Install project dependencies by running the following command:

```
$ npm install
```

- Create .envfile and add your environment variables:

```
  DB_HOST: your MongoDB connection string
  PORT: port of this program
  ACCESS_TOKEN_EXPIRES_IN: token validity period
  REFRESH_TOKEN_EXPIRES_IN: token validity period
  CLOUDINARY_NAME: cloudnery api name
  CLOUDINARY_KEY: cloudnery api key
  CLOUDINARY_SECRET: cloudnery api secret
  GOOGLE_CLIENT_ID: id google client
  GOOGLE_CLIENT_SECRET: secret string for signing google client
  BASE_URL= backend part
  FRONTEND_URL: frontend part (https://malakhow-alexandr.github.io/Team-Project-Organaizer-Goose-Track)
```

- Start the server by running the following command:

```
$ npm start

```
