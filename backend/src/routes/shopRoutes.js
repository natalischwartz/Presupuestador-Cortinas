import { Router } from 'express';
import {getProducts } from '../controllers/shopControllers.js'
const router = Router()

router.get('/', getProducts);


export default router;