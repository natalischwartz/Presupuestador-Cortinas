import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv'
config();
import shopRoutes from './src/routes/shopRoutes.js'

const PORT = process.env.PORT || 3000;
import { connectToDB } from './src/utils/mongoose.js';

try {
    await connectToDB();
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if there's a connection error
  }

const app = express();


app.use(shopRoutes);
var corsOptions = {
  origin: 'http://localhost:5173'
}
app.use(cors(corsOptions))

app.listen(PORT,()=> console.log(`http://localhost:${PORT}`));

export default app