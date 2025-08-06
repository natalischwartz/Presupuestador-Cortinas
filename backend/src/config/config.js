// aca van las variables de entorno 

import { config } from 'dotenv'
config();

export const MONGODB_URI = process.env['MONGODB_URI']

