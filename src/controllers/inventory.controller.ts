import { OK } from "~/middlewares/success.response"
import { NextFunction, Request, Response } from 'express'
import InventoryService from "~/services/inventory.service"

class InventoryController {
  addStockToInventory = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'Add stock to inventory successfully',
      metadata: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  }
}


export default new InventoryController()
