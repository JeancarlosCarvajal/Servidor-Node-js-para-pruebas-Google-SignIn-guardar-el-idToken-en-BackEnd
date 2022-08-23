const { response } = require('express'); // esto es para que aparezca los metodos y otras cosas
const { validarGoogleIdToken } =  require('../helpers/google_verify_token');

const AppleAuth = require("apple-auth"); // AppleAuth uso esto
const jwt = require("jsonwebtoken"); // jwt usa esto

// para acceder al archivo p8
const fs = require('fs'); // indica que require file system


const googleAuth = async ( req, res = response ) => {
  // Para pruebas
  // require('dotenv').config();
  // console.log(process.env.ANDROID_CLIENTE_ID);
  // console.log(process.env.WEB_ID_ANDROID);

    // TODO: obtener el token
    const token = req.body.token;

    if( !token ) return res.json({
      ok: false,
      msg: 'No hay token en la peticion'
    });

    const googleUser = await validarGoogleIdToken(token);

    // si el token no es valido
    if(!googleUser) return res.status(400).json({
      ok: false
    });

    // si el token es valido seguimos
    res.json({
      ok: true,
      googleUser
    });

    // TODO: Guardar en la base de datos

    // Era para pruebas
    // res.json({
    //   ok: true,
    //   token: token
    // });
    
} 

// controlador para Apple sign in
const callbackApple = async () => (request, response) => {
  const redirect = `intent://callback?${new URLSearchParams(
    request.body
  ).toString()}#Intent;package=${
    process.env.ANDROID_PACKAGE_IDENTIFIER
  };scheme=signinwithapple;end`;

  console.log(`Redirecting to ${redirect}`);

  response.redirect(307, redirect);
}

// sign in with apple
const signInWithApple = async (request, response) => {

  try { 
    const auth = new AppleAuth(
      {
        // use the bundle ID as client ID for native apps, else use the service ID for web-auth flows
        // https://forums.developer.apple.com/thread/118135
        client_id:
          request.query.useBundleId === "true"
            ? process.env.BUNDLE_ID
            : process.env.SERVICE_ID,
        team_id: process.env.TEAM_ID,
        redirect_uri:
          "https://google-sign-in-token.herokuapp.com/callbacks/sign_in_with_apple", // does not matter here, as this is already the callback that verifies the token after the redirection
        key_id: process.env.KEY_ID
      },
      fs.readFileSync('./keys/keysignin.p8').toString(),
      "text"
      // process.env.KEY_CONTENTS.replace(/\|/g, "\n"),
      // "text"
    );

    console.log(request.query);

    const accessToken = await auth.accessToken(request.query.code);

    const idToken = jwt.decode(accessToken.id_token);

    const userID = idToken.sub;

    // TODO:  Aqui esta la informaciond el usuario debe guardar en baser de datos para registro
    console.log(idToken);

    // `userEmail` and `userName` will only be provided for the initial authorization with your app
    const userEmail = idToken.email;
    const userName = `${request.query.firstName} ${request.query.lastName}`;

    // 👷🏻‍♀️ TODO: Use the values provided create a new session for the user in your system
    const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;

    console.log(`sessionID = ${sessionID}`); 
    response.json({ sessionId: sessionID });
  } catch (error) {
    response.json({
      'Error token Apple: ': error
    });
  }



}



module.exports = {
  googleAuth,
  callbackApple,
  signInWithApple
};