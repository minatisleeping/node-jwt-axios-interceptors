import mongoose from 'mongoose'
// import {countConnection} from '../helpers/check.connection'
const connectString = `mongodb+srv://minatt2002:shopdev@cluster0.m14vgac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(connectString).then(_ => console.log('Connected to MongoDB'))
.catch(err=> console.log('Failed to connect to MongoDB'))

class Database {
  constructor() {
    this._connect()
  }

  _connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    
    mongoose.connect(connectString, { maxPoolSize: 50 })
      .then(() => {
        console.log(`Database connection successful`, countConnection())
      })
      .catch(err => {
        console.error('Database connection error')
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instance = Database.getInstance()
export default instance
