import { Request, Response, NextFunction } from 'express'
import AccessService from '~/services/access.service'
import { OK, CREATED, SuccessResponse } from '~/middlewares/success.response'
import ProductFactory from '~/services/product.service'
class ProductController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        return new CREATED({
            message: 'Create product successfully',
            metadata: await ProductFactory.createProduct(req.body.product_type, {...req.body, product_shop: (req as any).user.userId})
        }).send(res)
    }
    
    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Update product successfully',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.product_id, {...req.body, product_shop: (req as any).user.userId})
        }).send(res)
    }

    publishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Publish product successfully',
            metadata: await ProductFactory.publishProductByShop({ product_shop: (req as any).user.userId, product_id: req.params.id })
        }).send(res)
    }

    unPublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Unpublish product successfully',
            metadata: await ProductFactory.unpublishProductByShop({ product_shop: (req as any).user.userId, product_id: req.params.id })
        }).send(res)
    }


    /**
     * @description Get list Draft
     * @param { Number } limit
     * @param { Number } skip
     * @returns { JSON}
     */
    getAllDraftsForShop = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Get list Draft success',
            metadata: await ProductFactory.findAllDraftsForShop({ product_shop: (req as any).user.userId })
        }).send(res)
    }

    getAllPublishedForShop = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Get list Published success',
            metadata: await ProductFactory.findAllPublishedForShop({ product_shop: (req as any).user.userId })
        }).send(res)
    }

    getListSearchProduct = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Search products success',
            metadata: await ProductFactory.getListSearchProduct({ keySearch: req.params.keySearch })
        }).send(res)
    }

    findAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Get list products success',
            metadata: await ProductFactory.findAllProducts({
                limit: Number(req.query.limit),
                sort: String(req.query.sort),
                page: Number(req.query.page),
                filter: req.query.filter
            })
        }).send(res)
    }

    findProduct = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Get product success',
            metadata: await ProductFactory.findProduct({ product_id: req.params.product_id })
        }).send(res)
    }
}

export default new ProductController()

