// Documentacion oficial
// https://developers.google.com/identity/sign-in/web/backend-auth#aria-tab-node.js 
const {OAuth2Client} = require('google-auth-library');

// acceder a las variables de entorno    https://www.npmjs.com/package/dotenv
require('dotenv').config();
// console.log(process.env.ANDROID_CLIENTE_ID);
// console.log(process.env.WEB_ID_ANDROID);

const clientAndroid = process.env.ANDROID_CLIENTE_ID;
const clientIOS = 'Pendiente';
const clientWeb = process.env.WEB_ID_ANDROID;

const client = new OAuth2Client(clientWeb); // tenia CLIENT_ID

const validarGoogleIdToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      // la audiencia es dede donde vienen los tokes, web, IOS and Android
      // se debe especificar los 3 tipos para poder codificarlos, estos tokens ID vienen desde https://console.cloud.google.com/apis/credentials?project=flutter-sing-in-app
      audience: [ // aqui van los dos tipos de clientes potenciales, falta IOS OJOJOJ
        clientAndroid,
        clientWeb
      ],  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    console.log(payload);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
      name: payload['name'],
      picture: payload['picture'],
      email: payload['email'],
    }
  } catch (error) {
    console.log('Error de Token: ', error);
    return null;
  }

} 
// lo trae desde google
// verify().catch(console.error);

module.exports = {
  validarGoogleIdToken
}