import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv'
config();
import shopRoutes from './src/routes/shopRoutes.js'

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors())

import { connectToDB } from './src/utils/mongoose.js';

try {
    await connectToDB();
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if there's a connection error
  }




app.use(shopRoutes);



app.listen(PORT,()=> console.log(`http://localhost:${PORT}`));

export default app