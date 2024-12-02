# Test Task by Grisha Yepiskoposyan

## Description
You can find task description file in the root directory ***(task-description.pdf)***

## Prerequisites

- Node.js, npm and Docker installed on your local machine

## How to start application?

1. Install dependencies:

```sh
npm install
```

2. Run _**docker-compose.yml**_ file to run **Postgres** container:

```sh
docker-compose up -d
```

3. Run database migrations to create necessary table(s)

```sh
npm run prisma-migrate:dev init
```

4. Run application:

```sh
npm start
```
or for dev mode
```sh
npm run start:dev
```