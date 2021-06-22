const {  Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, validarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear un nuevo usuario
router.post( '/new',[
    check('name','El nombre es obligatorio').notEmpty(),
    check('email', 'EL email es obligatorio').isEmail(),
    check('password', 'El largo de la contrasena es insuficiente').isLength({ min: 6}),
    validarCampos   
],
crearUsuario );

// login de usuario
router.post( '/',[
    check('email', 'EL email es obligatorio').isEmail(),
    check('password', 'El largo de la contrasena es insuficiente').isLength({ min: 6}),
    validarCampos   
], loginUsuario);

// validar y revalidar token
router.get( '/renew', validarJWT , validarToken );

module.exports = router;

