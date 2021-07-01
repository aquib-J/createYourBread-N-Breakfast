# createYourBreadAndBreakfast (cybnb)

[![CI | Deploy to DO Droplet](https://github.com/aquib-J/createYourBread-N-Breakfast/actions/workflows/main.yml/badge.svg)](https://github.com/aquib-J/createYourBread-N-Breakfast/actions/workflows/main.yml)

- [What is This Project About ?](#what-is-this-project-about)
- [Major Tech Stack Used](#tech-stack-and-services-used)
- [Design & Architecture](#design-and-architecture)
- [Dashboards & links](#dashboards)
- [CI & Deployment Pipeline](#ci-and-deployment-pipeline)
- [API documentation](#api-documentation)
- [Payment Flow](#payment-flow)
- [Building & Testing](#building-and-testing)
- [Todos and Roadmap](#todos)

## What is this project about?

I started this project a recently in my spare time (however much remains after the day job :laughing: ), just as an exercise mostly to reinforce some of the things I had picked up along the way and also to help a friend who was learning React to have a more or less functionally complete mini backend service , so that we both could practice building some non trivial front end applications around it. Along the way , I just kept on adding small additional changes, layer after layer.

It's still very much a work in progress and some of the earlier data modelling was not very carefully thought out, only to come around and bite me later, which made me add a lot of contrived logic which could have easily been avoided . The goal was never to have a serious project, but more of a `curiosity project` which was more or less `feature complete monolith application` which can stand on its own in real world usage.

To this end, I believe with some modification into it's models and the associated changes, it can be used as a stand-alone SAAS platform for people learning front end applications to make their own `mini AIRBNB setup` with no hassle to set up the backend.

## Tech stack and services used

- [<h4><b>Express</b>](https://expressjs.com/) on [<b>Node 12</b>](https://nodejs.org/en/about/) for Application server</h4>
- [<h4><b>PostgreSQL</b>](https://www.postgresql.org/) as primary data store with [<b>Sequelize</b>](https://github.com/sequelize/sequelize/) as the <b>ORM</b></h4>
- [<h4><b>Redis</b>](https://redis.io/) for <b>session caching</b> and also as a QUEUE</h4>
- [<h4><b>NGINX</b>](https://www.nginx.com/) as <b>a reverse proxy</b> and also for <b>load balancing</b></h4>
- [<h4><b>AWS S3</b>](https://aws.amazon.com/s3/) for Image storage</h4>
- [<h4><b>Docker & Docker Compose</b>](https://www.docker.com/) for Containerization and simple service orchestration</h4>
- [<h4><b>Github Actions</b>](https://github.com/features/actions) & [<b>Digital Ocean</b>](https://www.digitalocean.com/products/droplets/) for <b>CI & Deployments</b></h4>
- [<h4><b>Razorpay </b>](https://razorpay.com/docs/payment-gateway/) for Payment Integration</h4>
- [<h4><b>Bull</b>](https://github.com/OptimalBits/bull) for Queue management</h4>
- [<h4><b>bull-board</b>](https://github.com/felixmosh/bull-board) as an UI for the Queues</h4>
- [<h4><b>Nodemailer</b>](https://nodemailer.com/about/) for Emails</h4>
- [<h4><b>Redis Commander</b>](https://joeferner.github.io/redis-commander/) as an UI for the Redis clusters</h4>
- [<h4><b>Swagger</b>](https://swagger.io/) for API documentation</h4>

## Design and Architecture

<p align="center">
<img
    src="https://cybnb.s3.ap-south-1.amazonaws.com/cybnb-Arch-Diagram.jpeg"
    width="466" height="265" border="0">
<br>
</p>

## Dashboards

<h3>The project comes with Dashboards/UI for </h3>

- <b>Queues -> located at http://206.189.129.141/admin/queues</b>

- <b>Redis -> located at http://206.189.129.141:8081/</b>

- <b>UI for tinkering with Razorpay Payment Integration -> located at http://206.189.129.141/api/v1/payment/test-razorpay</b>
- <b>API documentation & testing -> located at http://206.189.129.141/api-docs</b>

## CI and Deployment Pipeline

The CI Pipeline is a fairly rudimentary one and consists of the following <b>Github Action</b> workflow which is triggered to run on every commit to 'main' branch.<br>
All it does is directly ssh into the DO droplet and shuts down the running containers, cleans up the dangling images, pulls in the latest source code and rebuilds from the <b>_docker-compose_</b> file, most of the other service images are precached anyways and are not rebuilt everytime.

```bash
name: CI | Deploy to DO Droplet
on:
  push:
    branches: [ main ]

  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - name: login, shutdown container, pull latest master and trigger fresh build
        uses: appleboy/ssh-action@master
        with:
          host: ${{secrets.DO_HOST}}
          username: ${{secrets.DO_USERNAME}}
          password: ${{secrets.DO_PASSWORD}}
          script: |
            cd createYourBread-N-Breakfast
            #set all the env variables here
            set -o allexport; source ~/.env; set +o allexport
            #shut down all the containers:
            docker-compose down
            # remove all the dangling containers
            docker rmi $(docker images -f dangling=true -q)
            git checkout main
            git pull
            #rebuild from the existing app as and when required
            docker-compose up --build -d

```

## API documentation

The repo contains the <b> postman collection </b> which can be used to test locally and the remote APIs.

<b>The swagger API documentation</b> can be found at

http://206.189.129.141/api-docs/

or at

http://localhost:{PORT}/api-docs/ ( if running locally)

## Payment Flow

We've integrated Razorpay Payment Gateway and the payment flow has been designed with that in mind, it's not a gateway agnostic design as of now

Razorpay Payment cycle consists of 3 major steps :

- order creation
- checkout creation ( triggers payment capture behind the scenes )
- payment verification

<p align="center">
<img
    src="https://razorpay.com/docs/assets/images/tech_flow_2.png"
    width="466" height="265" border="0">
<br>
</p>

- <b>UI we've built for tinkering with Razorpay Payment Integration -> located at http://206.189.129.141/api/v1/payment/test-razorpay</b>
  <b><br>The static Page explains everything in great detail</b> <br>

We have `Listings`, which we want to `book` by `payment`.

<b>To Book a Listing</b>

- We `create` a `booking`, if the booking is successfull, we get back a `bookingId`
- We `create` a `Payment Order` for the payment with the `bookingId` passed in the `payload` as `receipt` || `receiptId`
- `Checkout` is a stage which happens predominantly through the UI, once the checkout is complete, we can either pass
  - <b>a></b> `callback url`, which is automatically redirected to on payment completion
  - <b>a></b> `capture return values`, which can be used to verify the payment as we've used in the static page
- `Post Checkout`, the standart recommended way to verify payments in prod is by registering `webhooks` which we've done and we've added a status api which can be used to check if a payment has been successfull.

<b> To cancel a Booking</b>

- We `cancel` a `booking`, we receive a `gatewayPaymentId` in the response payload,
- We create a `Payment Refund` for the `gatewayPaymentId`, that's all.

The heavy lifting is done behind the scenes by the webhook processors, we've written.

## Building and Testing

    If we're building and testing it locally, with/without docker, we'd have to set up all the associated services mentioned above and also, sign up with services such as `nodemailer`, `razorpay`, `aws s3` (for image upload).

- Create an `.env` file in the `root directory` by copying over `.env-sample` file from the repo and fill up the `appropriate credentials`.

- Please refer to `.env-sample` file from the repo for the commplete reference

* ## Directly using npm script and a local .env file

```bash
touch .env
#copy the relevant info from .env-sample
nvm use v12.20.1
npm install
# make sure, you have postgres set up, redis set up, or their flags sets up to disable their invocation
npm run start

```

- ## Using docker-compose

```bash
# set up the environment variables, many ways to set up the env variables
printenv
#to verify the env variables have been set
#check into the root dir
docker-compose up -d
# to restart post some changes
docker-compose down
docker-compose up --build -d
# check the logs of the services to see if they've successfully started or if there's any issues
docker logs `serviceName` -f
```

## TODOs :

 <h3>List of Items to do, to convert it to a standalone <b>generic SAAS</b> like platform </h3>

### Roadmap

- [ ] Add JOI/validation to all the routes
- [x] Add Naive Caching to the appropriate API responses
- [ ] Appropriate HTML templates for Emails
- [ ] conversion of a normal user to a host be more informative and step wise with each step being locked in and verified by an admin backend(to be built)
- [ ] Currently the Redis/commander and Queue UI are unsecured, Add a singular Admin Authentication on those routes
- [x] Purchase a domain
- [ ] Set up `Certbot` on prod & get SSL certificate
- [ ] Update the models to include more common user attributes like mobileNo etc as well as to convert all the data model to be more centralised tenant specific,

### TODO besides Roadmap

- [ ] Write Mocks for all the APIs
- [ ] convert the entire project to TypeScript

## For feature request & contributions/corrections

- Please feel free to create an Issue
- shoot a mail at aquib.jansher@gmail.com
