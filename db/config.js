const  Mongoose  = require("mongoose")

const dbConnection = async() => {
    try{

        await Mongoose.connect(process.env.BD_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('BD online');

    } catch ( error ){
       console.log(error)
       throw new Error('Error a la hora de inicializado db')
    }
}

module.exports = {
    dbConnection
}