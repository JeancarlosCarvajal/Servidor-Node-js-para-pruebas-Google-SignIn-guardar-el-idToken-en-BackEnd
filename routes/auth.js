const { Router } = require('express');
const { googleAuth } = require('../controllers/auth')



const router = Router();

// en heroku resulto para mi caso https://google-sign-in-token.herokuapp.com/google
router.post('/google', googleAuth );



module.exports = router;
