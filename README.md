# Sports Complex

A NestJS-based API for managing sports classes and user enrollments.

## Project Setup

### Create a .env file
```bash
cp .env.example .env
```

### install the dependencies and setup the database
```bash
make setup
```

### Run the development server
```bash
make dev
```

## API Documentation

Swagger documentation is available at: http://localhost:3000/api#/

## Running tests and linters

```bash
npm run test

npm run test:cov

npm run lint
```

## Run with Docker

```bash
make up
```
