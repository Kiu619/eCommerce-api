import { Types } from "mongoose"
import keyTokenModel from "~/models/keyToken.model"


class KeyTokenService {
    
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken = null }: { userId: string, publicKey: string, privateKey: string, refreshToken?: string | null }) => {
    try {
        const filter = { user: userId }
        const update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken
        }
        const options = {
          upsert: true,
          new: true
        }
        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null
      } catch (error) {
        return null
    }
  }

  static findByUserId = async (userId: string) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id: string) => {
    return await keyTokenModel.findByIdAndDelete(id)
  }

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    const tokens = await keyTokenModel.findOne({
      refreshTokenUsed: refreshToken
    })
    return tokens ? tokens : null
  }

  static updateRefreshTokenUsed = async (id: string, refreshToken: string, refreshTokenUsed: string) => {
    return await keyTokenModel.findByIdAndUpdate(id, {
      $set: {
        refreshToken: refreshToken
      }, 
      $addToSet: {
        refreshTokensUsed: refreshTokenUsed
      }
    })
  }
}

export default KeyTokenService 

