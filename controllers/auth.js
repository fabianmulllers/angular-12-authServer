const { response } = require('express'); //importamos el tipado del response
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {
    
    const {name, email, password } = req.body;

    try {
        // verificar el email unico
        const usuario =  await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: `El email ${ email } ya existe `
            })
        }

        // crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // encriptar(hashear) la contrasena
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // generar el jwt

        const token = await generarJWT(dbUser.id, dbUser.name);

        // crear usuario en BD
        await dbUser.save();

        //generar respuesta existosa  
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
    
    } catch (error) {

        return res.status(500).json({
            ok:false,
            msg: 'Ocurrio un problema contactece con el admin'
        });
        
    }

    

    console.log( name, email, password );
    
    return res.json({
        ok: true,
        msg: 'Crear usuario /new'
    });

}

const loginUsuario = async( req, res = response) => {

    const {email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne( { email });

        if( !dbUser ){
            return res.status(400).json({
                ok:false,
                msg: 'el correo no existe'
            });
        }

        // confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'el password no es valido'
            });
        }

        // generar el jwt
        const token = await generarJWT( dbUser.id, dbUser.name );

        // respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Ocurrio un problema contactece con el admin'
        });
    }

}

const validarToken = async( req, res = response) => {

    const {uid} = req;
    const dbUser = await Usuario.findById(uid)
    const token = await generarJWT(uid, dbUser.uid);


    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    validarToken
}