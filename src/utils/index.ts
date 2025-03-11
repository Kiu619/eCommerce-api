import _ from 'lodash'

const getInfoData = ({fields = [], object = {}}: {fields: string[], object: any}) => {
  return _.pick(object, fields)
}

export {
  getInfoData
}

