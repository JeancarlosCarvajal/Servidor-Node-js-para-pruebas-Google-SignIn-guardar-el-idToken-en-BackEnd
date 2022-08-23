const { Router } = require('express');
const { googleAuth, callbackApple, signInWithApple } = require('../controllers/auth')



const router = Router();

// en heroku resulto para mi caso https://google-sign-in-token.herokuapp.com/google
router.post('/google', googleAuth );

// The callback route used for Android, which will send the callback parameters from Apple into the Android app.
// This is done using a deeplink, which will cause the Chrome Custom Tab to be dismissed and providing the parameters from Apple back to the app.
router.post("/callbacks/sign_in_with_apple", callbackApple);

// Endpoint for the app to login or register with the `code` obtained during Sign in with Apple
//
// Use this endpoint to exchange the code (which must be validated with Apple within 5 minutes) for a session in your system
router.post("/sign_in_with_apple", signInWithApple);

module.exports = router;
