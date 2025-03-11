import shopModel from "~/models/shop.model"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from "./keyToken.service"
import { createTokenPair, verifyJWT } from "~/auth/authUtils"
import { getInfoData } from "~/utils"
import { BadRequestError, AuthFailureError } from "~/middlewares/error.response"
import shopService from "./shop.service"
enum RoleShop {
  SHOP = 'SHOP',
  WRITER = 'WRITER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN'
}

class AccessService {
  static signUp = async ({email, password, name}: {email: string, password: string, name: string}) => {
      // step 1: check email exist
      const modelShop = await shopModel.findOne({email}).lean()
      if (modelShop) {
        throw new BadRequestError('Shop already exists')
      }
      // step 2: create new shop
      const hashPassword = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({email, password: hashPassword, name, roles: [RoleShop.SHOP]})

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id.toString(),
            publicKey,
            privateKey
        })

        if (!keyStore) {
            return {
                code: 'xxx',
                message: 'keyStore Error',
                status: 'error'
            }
        }

        const tokens = await createTokenPair({
            userId: newShop._id.toString(),
            email
        }, publicKey, privateKey)

        return {
          shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newShop
              }),
              token: tokens
        }
      }

      return {
        code: 200,
        metadata: null
      }
  }

  static signIn = async ({email, password, refreshToken = null}: {email: string, password: string, refreshToken: string | null}) => {
    const foundShop = await shopService.findByEmail({email, select: {
      email: 1, password: 1, name: 1, status: 1, roles: 1
    }})

    if (!foundShop) {
      throw new BadRequestError('Shop not found')
    }

    const match = bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new AuthFailureError('Authentication Error')
    }

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const tokens = await createTokenPair({
      userId: foundShop._id.toString(),
      email
    }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      userId: foundShop._id.toString(),
      publicKey,
      privateKey,
      refreshToken: tokens!.refreshToken
    })

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      token: tokens
    }
  }

  static logOut = async (keyStore: any) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  static refreshToken = async ({ keyStore, user, refreshToken }: {keyStore: any, user: any, refreshToken: string}) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyById(keyStore._id)
      throw new AuthFailureError('Something wrong happend!! Please relogin')
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop has changed, please relogin')
    }

    const foundShop = await shopService.findByEmail({email, select: {
      email: 1, password: 1, name: 1, status: 1, roles: 1
    }})

    if (!foundShop) {
      throw new BadRequestError('Shop not found')
    }

    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

    await KeyTokenService.updateRefreshTokenUsed(keyStore._id, tokens!.refreshToken, refreshToken) 

    return {
      user, tokens
    }
  }
}

export default AccessService

