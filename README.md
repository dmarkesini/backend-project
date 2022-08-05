# Backend API Project

## Table of Contents

- [About](#about)
  - [Built With](#built-with)
- [Installation](#installation)
- [Hosting](#hosting)

## About

This is a back-end API project built with Node.js which is the back-end JavaScript environment. This project enables us to perform CRUD operations for several endpoints.

Hosted version: https://social-interactive-project.herokuapp.com/api

### Built with

The following tools and libraries were used

[<img src="https://img.shields.io/badge/-Node.js-grey">](https://nodejs.org/en/) [<img src="https://img.shields.io/badge/-Express-green">](https://expressjs.com/) [<img src="https://img.shields.io/badge/-Postgres-orange">](https://www.npmjs.com/package/pg) [<img src="https://img.shields.io/badge/-Jest-blue">](https://www.npmjs.com/package/jest) [<img src="https://img.shields.io/badge/-Jest--Sorted-purple">](https://www.npmjs.com/package/jest-sorted) [<img src="https://img.shields.io/badge/-Husky-yellow">](https://www.npmjs.com/package/husky) [<img src="https://img.shields.io/badge/-Supertest-green">](https://www.npmjs.com/package/supertest) [<img src="https://img.shields.io/badge/-Pg--format-red">](https://www.npmjs.com/package/pg-format) [<img src="https://img.shields.io/badge/-Dotenv-purple">](https://www.npmjs.com/package/dotenv)


---

## Installation

To run the project locally you need to clone the repository and then run the following commands on the terminal.

<b>NOTE: The minimum version of Node.js to run the project is v6.9 and v8.7 for Postgres. </b>

1. First, please fork the project from this link https://github.com/dmarkesini/Backend-project.git

2. To clone the project on your device enter this command into the terminal along with the link of your forked project

```sh
git clone <project_name_here>
```

3. Then, go into the directory and open the project

```sh
cd Backend-project
```

4. Install the dependencies with this command

```sh
npm install
```

5. To be able to run this project locally, you will need to create the following two <b>.env</b> files in the main directory:

```sh
1. .env.test
2. .env.development
```

Inside the files you need to add this: <b>PGDATABASE=<database_name_here></b> which will need to include the right database name for that environment. Please check the <b> /db/setup.sql</b> file for the accurate database names.

Lastly, you need to make sure these files are inside the .gitignored file. You can do this with writing <b>.env.\*</b> inside .gitignore.

6. Once you have all dependencies installed, you can go ahead and seed the local database

```sh
npm run setup-dbs
```

7. Once the database is seeded, you are good to go! You can run the tests with Jest by typing the following

```sh
npm test app.test.js
```

---

## Hosting

This Node.js app is hosted on [Heroku](https://dashboard.heroku.com/apps) at https://social-interactive-project.herokuapp.com/api.
Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud, for free.

---
