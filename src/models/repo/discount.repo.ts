import { SortOrder } from "mongoose"
import discountModel from "../discount.model"
import { getSelectData, unGetSelectData } from "~/utils"
import { filter } from "lodash"

const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model }: { limit: number, page: number, sort: string, filter: any, unSelect: string[], model: any }) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

  return documents
}

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }: { limit: number, page: number, sort: string, filter: any, select: string[], model: any }) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return documents
}

const checkDiscountExits = async ({ model, filter }: { model: any, filter: any }) => {
  return await model.findOne(filter).lean()
}


export const discountRepo = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExits
}
