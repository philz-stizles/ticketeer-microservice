# TICKETEER

## Resources

## Services

### Auth Service

- Description: Everything related to user sign up/sign in or sign out
- Installation:
  Global typescript: npm install -g typescript
  Dependencies: npm install typescript ts-node-dev express @types/express
  create typescript file: tsc --init
- Docker build: docker build -t philzstizles/auth .

### Ticket Services - Ticket creation/editing. Knows whether a ticket can be updated

### Orders Service - Order creation/editing

- Expiration Services - watches for orders to be created, cancels them after 15 minutes expiration time
- Payments Service - Handles credit card payments. Cancels orders if payments fails, completes if payments succeeds

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
# ticketeer
