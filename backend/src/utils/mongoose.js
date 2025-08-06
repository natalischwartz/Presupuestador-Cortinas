import mongoose from 'mongoose'
import {MONGODB_URI} from '../config/config.js'

 export async function connectToDB(){
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Mongodb connected')
    } catch (error) {
        console.error(error)
        
    }
    
}
