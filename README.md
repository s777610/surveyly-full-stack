# Surveyly-Full-Stack

This application([Surveyly](https://protected-depths-22405.herokuapp.com/)) was mainly built by Node.js, React, Redux and MongoDB. The back-end was built by express, which is a light-weight framework of Node.js. The data is stored on MongoDB and hosted on mLab. The client-side of this application was built by React and Redux. I used create-react-app to set up my configuration and workflow. In addition, it uses redux-thunk as middleware for dispatching actions in order to make HTTP requests to express server properly.

## Functionality:

1. Login:
   Users can log in this application via google account. It implements OAuth 2.0. It uses passport and GoogleStrategy to manage auth. After login, the information fo users will be stored on MongoDB.

2. Payment:
   Clients can make payments by Stripe, which is very useful API. You can test it in test mode. In test mode, use 4242 4242 4242 4242 as card number to test it properly.

3. Send Survey Email:
   The clients can send many survey email to their users if clients have enough credits. Each survey costs 1 credit.

## Installation:

1. Install packages:

```
npm install
```

2. Create Account:
   You have to create mlab, google, stripe, and sendgrid account in order to run and test it in dev mode properly.

3. Create keys:
   You will have to create dev.js file under the config folder. Then, copy the content of prod.js and paste it to dev.js you just created. Then, replace all keys with your keys.

```
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  sendGridKey: process.env.SEND_GRID_KEY,
  redirectDomain: process.env.REDIRECT_DOMAIN
};
```

## Architecture of Front-End

```
├── actions
│   ├── index.js
│   └── types.js
├── components
│   ├── App.js
│   ├── Dashboard.js
│   ├── Header.js
│   ├── Landing.js
│   ├── Payments.js
│   └── surveys
│       ├── SurveyField.js
│       ├── SurveyForm.js
│       ├── SurveyFormReview.js
│       ├── SurveyList.js
│       ├── formFields.js
│       └── surveyNew.js
├── index.js
├── reducers
│   ├── authReducer.js
│   ├── index.js
│   └── surveysReducer.js
├── serviceWorker.js
├── setupProxy.js
└── utils
    └── validateEmail.js
```

## Architecture of Back-End

```
├── config
│   ├── dev.js
│   ├── keys.js
│   └── prod.js
├── index.js
├── middlewares
│   ├── requireCredits.js
│   └── requireLogin.js
├── models
│   ├── Recipient.js
│   ├── Survey.js
│   └── User.js
├── package-lock.json
├── package.json
├── routes
│   ├── authRoutes.js
│   ├── billingRoutes.js
│   └── surveyRoutes.js
└── services
    ├── Mailer.js
    ├── emailTemplates
    │   └── surveyTemplate.js
    └── passport.js
```
