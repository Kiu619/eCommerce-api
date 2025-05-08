import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import cartController from '~/controllers/cart.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
router.use(authenticationV2)

router.post('/add', asyncHandler(cartController.addToCart))
router.delete('/delete', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('/list', asyncHandler(cartController.listToCart))


export const cartRouter = router as express.Router
