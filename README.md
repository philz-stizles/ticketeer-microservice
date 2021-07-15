# TICKETEER

## Resources

## Services

### Auth Service

- Description: Everything related to user sign up/sign in or sign out
- Dependencies: npm install express @types/express
- Typescript:
  - Install typescript globally to use tsc: npm install -g typescript
  - Create typescript file in project: tsc --init
  - Dependencies: npm install typescript ts-node-dev
- Docker:
  - docker build -t philzstizles/auth .
- Jest:
  - Install dependencies: npm install -D jest ts-jest @types/jest supertest @types/supertest mongodb-memory-server
  - Configure Dockerfile: RUN npm install --only=prod
  - Add your configs to 'jest.config.js'
  - Configure 'package.json'
    "scripts": {
    "start": "ts-node-dev src/index.ts",
    "test": "jest --watchAll --no-cache"
    },
    "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "setupFilesAfterEnv": [
    "./src/test/setup.ts"
    ]
    },

### Ticket Services - Ticket creation/editing. Knows whether a ticket can be updated

### Orders Service - Order creation/editing

- Overview:
  - It keeps track of who is attempting to purchase a ticket at any given time.
  - It will have information to lock down the ticket and not allow anyone else
    to purchase the ticket

### Expiration Services

- Overview:
  - It watches for orders to be created,
  - It cancels them after 15 minutes expiration time

### Payments Service

- Overview:
  - It handles credit card payments.
  - It cancels orders if payments fails.
  - completes if payments succeeds.

## Events

- UserCreated | UserUpdated
- OrderCreated | OrderCancelled | OrderExpired
- TicketCreated | TicketUpdated
- ChargeCreated

## Ingress Nginx Controller

C:\Windows\System32\drivers\etc

127.0.0.1 ticketeer.com

## Kubernetes MongoDB Pod

Note: Whenever we delete or restart the pod running MongoDB, we will lose all of the data in it. This could be fixed by:

## Client

- Setup Next JS:
  npm init -y
  npm install next react react-dom
- Configure package.json:
  "scripts": {
  "dev": "next"
  },
- install axios: npm install axios
- getServerSideProps

## Common

- Publish to npm:
  - git init
  - git add .
  - git commit -m 'Some message'
  - npm login
  - npm publish --access public
  - npm version patch
  - npm run build
  - npm publish
- Typescript:
  - npm install -D typescript del-cli
  - tsconfig.json:
    "declaration": true
    "outDir": "./build"
  - package.json:
    "main": "./build/index.js",
    "types": "./build/index.d.ts",
    "scripts": {
    "clean": "del-cli ./build/\*",(Windows) Or "clean": "del ./build/\*",
    "build": "npm run clean && tsc"
    },
- Install dependencies:
  npm install express express-validator jsonwebtoken cookie-session @types/jsonwebtoken @types/express @types/cookie-session
- Update & publish to npm:

  - git add .
  - git commit -m 'Some message'
  - npm version patch
  - npm run build
  - npm publish

## Nats

- Create nats pod
- Create nats service
  npm install typescript ts-node-dev node-nats-streaming @types/node
- Access a running pod in a strictly development setting
  - open separate terminal:
    > kubectl port-forward %nats-server-kubernetes-pod-name% %local-port%:%nats-server-pod-port%
