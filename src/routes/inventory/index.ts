import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import inventoryController from '~/controllers/inventory.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()
// authentication
router.use(authenticationV2)

router.post('/add_stock', asyncHandler(inventoryController.addStockToInventory))

export const inventoryRouter = router as express.Router
