import { Request, Response, NextFunction } from 'express'
import AccessService from '~/services/access.service'
import { OK, CREATED, SuccessResponse } from '~/middlewares/success.response'

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        return new CREATED({
            message: 'Signup successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Signin successfully',
            metadata: await AccessService.signIn(req.body)
        }).send(res)
    }

    logOut = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Logout successfully',
            metadata: await AccessService.logOut((req as any).keyStore)
        }).send(res)
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        return new OK({
            message: 'Refresh token successfully',
            metadata: await AccessService.refreshToken({ keyStore: (req as any).keyStore, user: (req as any).user, refreshToken: (req as any).refreshToken })
        }).send(res)
    }
}

export default new AccessController() 
 