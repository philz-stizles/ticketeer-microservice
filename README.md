# TICKETEER

## Overview

- CICD pipeline: Github > Github Actions > Digital Ocean

## Technologies

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

- Overview:
  - It is used to create, update, list tickets.
- Events:
  - Listeners:
    order:create - It should reserve a ticket if a corresponding order has been created.
    order:cancelled - It should unreserve a ticket if the corresponding order has been cancelled
  - Publishers:
    ticket:created
    ticket:updated
- Dependencies:
  npm install mongoose-update-if-current

### Orders Service - Order creation/editing

- Overview:
  - It keeps track of who is attempting to purchase a ticket at any given time.
  - It will have information to lock down the ticket and not allow anyone else
    to purchase the ticket.
- Events:
  - Listeners:
    ticket:create - So that the order service knows the valid tickets that can be purchased.
    The order service needs to know the price of each ticket
- Dependencies:
  npm install mongoose-update-if-current

### Expiration Services

- Overview:
  - It watches for orders to be created,
  - It cancels orders after 15 minutes expiration time
- Install dependencies
  npm install bull @types/bull node-nats-streaming ts-node-dev @devdezyn/common typescript
  npm install -D @types/jest jest ts-jest
- Docker:
  docker build -t philzstizles/expiration .
  docker publish

### Payments Service

- Overview:
  - It handles credit card payments.
  - It cancels orders if payments fails.
  - completes if payments succeeds.
- Events:
  - It listens/receives an event of order:created, this is so it knows how much money
    it should be receiving
  - It listens/receives an event of order:cancelled, this is so it knows that any incoming payments for this order should be rejected.
  - It emits a charge:created event as the order service needs to know that an order has been paid for.
- Docker
  - Build image: docker build -t philzstizles/payments .
  - Push image to docker hub: docker publish
- Creating a stripe secret:

  ```bash
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<stripe secret>
  ```

- Creating a stripe env variable:

  ```yaml
  env:
    - name: STRIPE_KEY
      valueFrom:
        secretKeyRef:
          name: stripe-secret
          key: STRIPE_KEY
  ```

## Leveraging a Cloud Environment for Development

- [https://cloud.google.com/sdk/docs/quickstart](Google Cloud SDK)
- Select Getting started with Cloud SDK > Windows
- cmd > gcloud
- gcloud auth login
- gcloud init
- Installing the GCloud Context:

  ```bash
  gcloud container clusters get-credentials <cluster name>
  ```

- Enable Google Cloud Build:
- Update 'skaffold.yaml' file:
- Setup ingress-nginx on google cloud cluster
- update hosts file to point to remote cluster
- Restart Skaffold

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
- thisisonsafe

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

## Stripe

- Configure Stripe:

  - Signup & [https://dashboard.stripe.com/login](Sign in to Stripe)
  - Retrieve secret key from Developers > API Key
  - Create kubernetes secret:

    ```bash
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=secret_key_from_stripe_dashboard
    ```

  - Configure Payment Service pod env

- Configure Stripe on Client:
- Configure Stripe on Server:
  Overview:
  Install package: npm install stripe

## Deployment

- Options:
  Digital Ocean Deploy[$40/month]
  AWS[$126/month]
  Google Cloud Platform[$113/month]
  Azure[$72/month]
- Digital Ocean Deployment:

  - Configure Digital Ocean:
  - Install Digital Ocean CLI:

    ```txt
    Kubernetes > Install management tools
    ```

    [https://github.com/digitalocean/doctl](Doctl Installation Docs)

    - [https://github.com/digitalocean/doctl/releases](Download doctl zip)
    - Extract to folder 'DigitalOcean' and add to PATH 'C:\DigitalOcean'

  - Authenticate with Digital Ocean Account:

    ```txt
    API > Generate New Token > copy token
    ```

    ```bash
    > doctl auth init
    Enter your access token: <access token> + Enter
    ```

  - Get connection info for digital ocean cluster:

    ```bash
    doctl kubernetes clusters kubeconfig save <cluster name>
    ```

  - List all contexts:

    ```bash
    kubectl config view
    ```

  - Use a different context:

    ```bash
    kubectl config use-context <context name>
    ```

  - List nodes:

    ```bash
    kubectl get nodes
    ```

  - Create digital ocean secrets:

    ```bash
    kubectl config use-context <context name>

    ```

  - Configure Ingress-nginx: [https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean](Installation Guide)

    ```bash
      kubectl config view
      kubectl config use-context <digital ocean context>
      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.0/deploy/static/provider/do/deploy.yaml
    ```
