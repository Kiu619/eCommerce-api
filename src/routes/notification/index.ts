import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import notificationController from '~/controllers/notification.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()

// Not login yet

// authentication
router.use(authenticationV2)

router.get('/', asyncHandler(notificationController.listNotiByUser))

export const notificationRouter = router as express.Router
