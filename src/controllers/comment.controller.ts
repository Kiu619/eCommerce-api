import { Request, Response } from "express"
import CommentService from "../services/comment.service"
import { OK, CREATED } from "~/middlewares/success.response"

class CommentController {
    createComment = async (req: Request, res: Response) => {
        new CREATED({
            message: 'Create comment successfully',
            metadata: await CommentService.createComment({
              userId: (req as any).user.userId,
              ...req.body
            })
        }).send(res)
    }

    getCommentsByParentId = async (req: Request, res: Response) => {
        new OK({
            message: 'Get comments by parent id successfully',
            metadata: await CommentService.getCommentsByParentId({
                productId: req.params.productId,
                parentId: req.params.parentId,
                skip: Number(req.query.skip),
                limit: Number(req.query.limit)
            })
        }).send(res)
    }

    deleteComment = async (req: Request, res: Response) => {
        new OK({
            message: 'Delete comment successfully',
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }
}

export default new CommentController()
