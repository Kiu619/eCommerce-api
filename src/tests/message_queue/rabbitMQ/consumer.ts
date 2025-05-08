import amqp from 'amqplib'

const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost:5672')
    const channel = await connection.createChannel()
    
    const queueName  = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.consume(queueName, (msg: amqp.Message | null) => {
      if (msg) {
        console.log(`Received message: ${msg.content.toString()}`)
        channel.ack(msg)
      }
    })

    console.log(`Waiting for messages...`)
    
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

runConsumer().catch(console.error)
