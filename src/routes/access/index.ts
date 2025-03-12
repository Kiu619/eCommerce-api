import express from 'express'
import { authenticationV2 } from '~/auth/authUtils'
import accessController from '~/controllers/access.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = express.Router()

router.post('/signUp', asyncHandler(accessController.signUp)) 
router.post('/signIn', asyncHandler(accessController.signIn))

router.use(authenticationV2)
router.post('/logOut', asyncHandler(accessController.logOut))
router.post('/refreshToken', asyncHandler(accessController.refreshToken))

export const shopRouter = router as express.Router
