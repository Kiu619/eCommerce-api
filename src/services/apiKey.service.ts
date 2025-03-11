import apiKeyModel from "~/models/apiKey.model"
import crypto from 'crypto'

const findById = async ( key: string ) => {
  const objKey = await apiKeyModel.findOne({
    key,
    status: true
  }).lean()
  return objKey
}

export default {
  findById
}
