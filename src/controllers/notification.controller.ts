import { Request, Response } from "express"
import NotificationService from "../services/notification.service"
import { OK, CREATED } from "~/middlewares/success.response"

class NotificationController {
  listNotiByUser = async (req: Request, res: Response) => {
    new OK({
      message: 'List notification by user successfully',
      metadata: await NotificationService.listNotiByUser({
        // userId: (req as any).user.userId,
        ...(req as any).query
      })
    }).send(res)
  }
}

export default new NotificationController()
