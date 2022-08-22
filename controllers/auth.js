const { response } = require('express'); // esto es para que aparezca los metodos y otras cosas


const googleAuth = ( req, res = response ) => {
    // TODO: obtener el token
    const token = req.body.token;


    res.json({
      ok: true,
      token: token
    });
    
} 


module.exports = {
  googleAuth
};