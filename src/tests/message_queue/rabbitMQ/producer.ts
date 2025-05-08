import amqp from 'amqplib'
const message = 'Hello, RabbitMQ'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost:5672')
    const channel = await connection.createChannel()
    
    const queueName  = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    //send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })

    console.log(`Message sent: ${message}`)

    await channel.close()
    await connection.close()
    
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

runProducer().catch(console.error)
