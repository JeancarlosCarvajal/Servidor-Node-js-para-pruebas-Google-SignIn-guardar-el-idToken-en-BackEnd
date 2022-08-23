const { response } = require('express'); // esto es para que aparezca los metodos y otras cosas
const { validarGoogleIdToken } =  require('../helpers/google_verify_token');

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


module.exports = {
  googleAuth
};