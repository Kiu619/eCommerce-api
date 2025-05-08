import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import checkoutController from '~/controllers/checkout.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()

// authentication
router.use(authenticationV2)

router.post('/review', asyncHandler(checkoutController.checkoutReview))


export const checkoutRouter = router as express.Router
