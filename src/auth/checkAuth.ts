
import { Request, Response, NextFunction } from 'express'
import apiKeyService from '~/services/apiKey.service'
import { HEADER } from '~/utils/constants'

const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // check objKey
        const objKey = await apiKeyService.findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }  
        // Extend Request type to include objKey
        (req as any).objKey = objKey
        return next()
    } catch (error) {
        return res.status(403).json({
            message: 'Forbidden Error'
        })
    }
}

const permission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!(req as any).objKey.permissions) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }

    const validPermission = (req as any).objKey.permissions.some((permission: string) => permissions.includes(permission))
    if(!validPermission) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }
    return next()
  }
}


export default {
  apiKey,
  permission,
}
