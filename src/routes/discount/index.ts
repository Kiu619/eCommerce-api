import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import discountController from '~/controllers/discount.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()

// get amount discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

// authentication
router.use(authenticationV2)

router.post('/create', asyncHandler(discountController.createDiscountCode))
router.get('/', asyncHandler(discountController.getAllDiscountCodes))

export const discountRouter = router as express.Router
