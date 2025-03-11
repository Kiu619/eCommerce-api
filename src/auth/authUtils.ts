import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from '~/helpers/asyncHandler'
import { HEADER } from '~/utils/constants'
import { AuthFailureError, NotFoundError } from '~/middlewares/error.response'
import KeyTokenService from '~/services/keyToken.service'

// Extend Request type
interface AuthRequest extends Request {
  keyStore?: any;
  user?: any;
  refreshToken?: string;
}

const createTokenPair = async (payload: any, publicKey: string, privateKey: string  ) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: '2 days',
      // comment để dùng thuật toán đơn giản hơn vì nếu dùng RS256 thì publicKey phải là phải ở định dạng pem
      // algorithm: 'RS256'
    })

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days',
      // comment để dùng thuật toán đơn giản hơn
      // algorithm: 'RS256'
    })
    
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify::', err)
      } else {
        console.log('decode verify::', decode)
      }
    })
    
    return { accessToken, refreshToken }
  } catch (error) {
    return null
  }
}

const authentication = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()
  if (!userId) {
    throw new AuthFailureError('Invalid Request')
  }

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore')
  }
  
  const accessToken = req.headers.authorization?.toString()
  if (!accessToken) {
    throw new AuthFailureError('Invalid Request')
  }

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey) as { userId: string, email: string }

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid User')
    }

    req.keyStore = keyStore
    req.user = decodeUser
    return next() 
  } catch (error) {
    console.error('JWT verification error:', error)
    throw new AuthFailureError('Invalid Request')
  }
})

const authenticationV2 = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString()
  if (!userId) {
    throw new AuthFailureError('Invalid Request')
  }

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore')
  }

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try { 
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString()
      
      if (!refreshToken) {
        throw new AuthFailureError('Invalid Request')
      }

      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey) as unknown as { userId: string, email: string }

      if (userId !== decodeUser.userId) {
        throw new AuthFailureError('Invalid User')
      }
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw new AuthFailureError('Invalid Request')
    }
  }
  const accessToken = req.headers.authorization?.toString()
  if (!accessToken) {
    throw new AuthFailureError('Invalid Request')
  }

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey) as { userId: string, email: string }

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid User')
    }

    req.keyStore = keyStore
    req.user = decodeUser
    return next() 
  } catch (error) {
    console.error('JWT verification error:', error)
    throw new AuthFailureError('Invalid Request')
  }
})
const verifyJWT = async (token: string, keySecret: string) => {
  return jwt.verify(token, keySecret)
}

export {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT
}
