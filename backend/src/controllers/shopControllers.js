import Product from '../models/product.model.js'

 export const getProducts = async (req,res) => {
        try {
        // Consulta a la base de datos sin ordenar

        const productsCortineria = await Product.find({"category": "cortineria"})
         // Convertir `price` de cadena a número
        productsCortineria.forEach(product => {
        product.price =Number(product.price.replace(/[^0-9.-]+/g,"")) ;
        });
        res.json(productsCortineria);


        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }

}
