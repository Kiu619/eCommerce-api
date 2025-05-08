import amqp from 'amqplib'

const orderedProducerMessage = async () => {
  const connection = await amqp.connect('amqp://guest:123456@localhost:5672')
  const channel = await connection.createChannel()

  const queueName = 'orderedQueue'
  await channel.assertQueue(queueName, {
    durable: true
  })

  for (let i = 0; i < 10; i++) {
    const message = `ordered message ${i}`
    console.log('send message to ordered queue', message)
    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })
  }

  setTimeout(() => {
    connection.close()
  }, 1000)
}

orderedProducerMessage().catch(console.error)
