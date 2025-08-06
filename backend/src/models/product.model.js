import mongoose from 'mongoose'


const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    imagen: {type:String}
    // stock: { type: Number, required: true }
});


// Qué datos quiero guardar de un producto
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, //quita espacios en blanco
        unique: true, // no se puede repetir el nombre del producto.
    },
    description: {
        type: String,
        required:true,
    },
    width: {
        type: String
    },
    price: {
        type: String,
        default: 0
    },
    image: {
        public_id: String,
        secure_url: String
    },
    variants: [variantSchema],
    provider: {
        type: String
    },
    category: {
        type: String
    }
}, {
    timestamps: true,//fecha de creacion y fecha de act.
    versionKey: false 
});

productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text',
    provider: 'text',
});

export default mongoose.model('Product', productSchema) //model es una funcion del modulo de mongoose y el nombre del modelo es Product