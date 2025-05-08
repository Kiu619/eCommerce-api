import express, { Request, Response } from 'express'
import { shopRouter } from './access'
import checkAuth from '~/auth/checkAuth'
import { productRouter } from './product'
import { discountRouter } from './discount'
import { cartRouter } from './cart'
import { checkoutRouter } from './checkout'
import { inventoryRouter } from './inventory'
import { commentRouter } from './comment'
import { notificationRouter } from './notification'
// import { pushToLogDiscord } from '~/middlewares/logger'

const router = express.Router()

// push to log discord
// router.use(pushToLogDiscord)

// check permission
router.use(checkAuth.apiKey as express.RequestHandler )
router.use(checkAuth.permission(['0000']) as express.RequestHandler)

// routes
// router.use('/discord', discordRouter)
router.use('/comment', commentRouter)
router.use('/discount', discountRouter)
router.use('/checkout', checkoutRouter)
router.use('/cart', cartRouter)
router.use('/inventory', inventoryRouter)
router.use('/product', productRouter)
router.use('/notification', notificationRouter)
router.use('/shop', shopRouter)

export default router as express.Router
