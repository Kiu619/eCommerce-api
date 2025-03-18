import express, { Request, Response } from 'express'
import { shopRouter } from './access'
import checkAuth from '~/auth/checkAuth'
import { productRouter } from './product'
import { discountRouter } from './discount'

const router = express.Router()

// check permission
router.use(checkAuth.apiKey as express.RequestHandler )
router.use(checkAuth.permission(['0000']) as express.RequestHandler)

// routes
router.use('/discount', discountRouter)
router.use('/product', productRouter)
router.use('/shop', shopRouter)


export default router as express.Router
