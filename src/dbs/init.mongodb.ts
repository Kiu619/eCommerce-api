import mongoose from 'mongoose'
import { countConnect } from '../helpers/check.connect'
import config from '../configs/config.mongodb'

const connectionString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`
// singleton pattern
class Database {

  constructor () {
    this.connect()
  }

  connect(type = 'mongodb') {
    if (1 == 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose.connect(connectionString, {
      maxPoolSize: 50
    }).then( _ => {
      console.log('Connected to Mongodb Success', countConnect())
    })
    .catch( err => console.log('Connect Error'))
  }

  private static instance: Database

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

export default instanceMongodb
