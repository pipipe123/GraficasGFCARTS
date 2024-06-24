import moongose from "mongoose"
const competidorSchema = new moongose.Schema({
    totalAreas:{
        type: Number,
        require: true
    },
    cantidadCompetidores:{
        type: Number,
        require: true
    },
    cantidadjueces:{
        type: Number,
        require: true
    },
    codigo:{
        type: String,
        require: true
    },
    
})


export default moongose.model('Evento', competidorSchema)