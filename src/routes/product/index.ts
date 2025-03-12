import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import accessController from '~/controllers/access.controller'
import asyncHandler from '~/helpers/asyncHandler'
import productController from '~/controllers/product.controller'

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)

router.patch('/:product_id', asyncHandler(productController.updateProduct))
router.post('/createProduct', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))
// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))

export const productRouter = router as express.Router

