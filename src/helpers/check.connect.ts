import mongoose from 'mongoose'
import os from 'os'
import process from 'process'
const _SECONDS = 5000

const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // Example: numConnection: 10, numCores: 4, memoryUsage: 0.75
    console.log(`Active connections: ${numConnection}`)

    if (numConnection > numCores * 5) {
      console.log('Connection overload detected!')
    }
  }, _SECONDS)
}

export {
  countConnect,
  checkOverload
}
