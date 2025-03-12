import {pick} from 'lodash'

const getInfoData = ({fields = [], object = {}}: {fields: string[], object: any}) => {
  return pick(object, fields)
}

// ['product_name', 'product_price'] => { product_name: 1, product_price: 1 }
const getSelectData = (select: string[]) => {
  return Object.fromEntries(select?.map(e => [e, 1]))
}

// ['product_name', 'product_price'] => { product_name: 0, product_price: 0 }
const unGetSelectData = (select: string[]) => { 
  return Object.fromEntries(select.map(e => [e, 0]))
}

const removeUndefinedObject = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  })

  return obj
}

const updateNestedObjectParser = (obj: any): Record<string, any> => {
  const final: Record<string, any> = {}

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach(i => {
        final[`${key}.${i}`] = response[i]
      })
    } else {
      final[key] = obj[key]
    }
  })
  return final
}

export {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser
}

