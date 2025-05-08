import { NotFoundError } from "~/middlewares/error.response"
import commentModel from "../models/comment.model"
import { Types } from "mongoose"
import { productRepo } from "~/models/repo/product.repo"
class CommentService {
    static async createComment({productId, userId, content, parentId = null}: {productId: string, userId: string, content: string, parentId: string | null}) {
        const comment = await commentModel.create({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentId
        })

        let rightValue: number = 1
        if (parentId) {
            // reply comment
            const parentComment = await commentModel.findById(new Types.ObjectId(parentId))
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found')
            }
            rightValue = parentComment.comment_right
            //right value of all comment
            await commentModel.updateMany({
                comment_productId: (productId),
                comment_right: {$gte: rightValue}  
            }, {
              $inc: {
                comment_right: 2
              }
            })

            //lef value of all comment
            await commentModel.updateMany({
              comment_productId: (productId),
              comment_left: {$gt: rightValue}
          }, {
            $inc: {
              comment_left: 2
            }
          })
        } else {
            const maxRightValue = await commentModel.findOne({comment_productId: new Types.ObjectId(productId)}, 'comment_right', {sort: {comment_right: -1}})

            rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1
        await comment.save()
        return comment
    }
    
    static async getCommentsByParentId({productId, parentId, skip = 50, limit = 0}: {productId: string, parentId: string, skip: number, limit: number}) {
        if (parentId) {
          const parent = await commentModel.findById(new Types.ObjectId(parentId))

          if (!parent) {
            throw new NotFoundError('Not found comment')
          }

          const comments = await commentModel.find({
            comment_productId: new Types.ObjectId(productId),
            comment_parentId: (parentId)
          }).sort({comment_left: 1}).select({
            comment_content: 1,
            comment_left: 1,
            comment_right: 1,
            comment_parentId: 1
          })

          return comments
        }
    }

    static async deleteComment({ commentId, productId }: { commentId: string, productId: string }) {
      const foundProduct = await productRepo.findProduct({product_id: productId, unSelect: ['product_price']})
      if (!foundProduct) {
        throw new NotFoundError('Product not found')
      }

      const foundComment = await commentModel.findById(new Types.ObjectId(commentId))
      if (!foundComment) {
        throw new NotFoundError('Comment not found')
      }

      const leftValue = foundComment.comment_left
      const rightValue = foundComment.comment_right

      const width = rightValue - leftValue + 1

      await commentModel.deleteMany({
        comment_productId: new Types.ObjectId(productId),
        comment_left: {$gte: leftValue},
        comment_right: {$lte: rightValue}
      })

      await commentModel.updateMany({
        comment_productId: new Types.ObjectId(productId),
        comment_left: {$gt: rightValue}
      }, {
        $inc: {comment_left: -width}
      })

      await commentModel.updateMany({
        comment_productId: new Types.ObjectId(productId),
        comment_right: {$gt: rightValue}
      }, {
        $inc: {comment_right: -width}
      })

      return true
    }
}

export default CommentService
