import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import commentController from '~/controllers/comment.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()
// authentication
router.use(authenticationV2)

router.post('/', asyncHandler(commentController.createComment))
router.get('/:productId/:parentId', asyncHandler(commentController.getCommentsByParentId))
router.delete('/', asyncHandler(commentController.deleteComment))

export const commentRouter = router as express.Router
