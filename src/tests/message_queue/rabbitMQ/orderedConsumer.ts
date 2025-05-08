import amqp from 'amqplib'

const orderedConsumerMessage = async () => {
  const connection = await amqp.connect('amqp://guest:123456@localhost:5672')
  const channel = await connection.createChannel()

  const queueName = 'orderedQueue'
  await channel.assertQueue(queueName, {
    durable: true
  })

  // set prefetchCount - make sure the message is processed one by one
  await channel.prefetch(1)

  await channel.consume(queueName, (message) => {
    if (message) {
      // Simulate processing time (như là trường hợp mạng chậm)
      setTimeout(() => {
        console.log('received message from ordered queue', message.content.toString())
        channel.ack(message)
      }, Math.random() * 1000)
    }
  })
}

orderedConsumerMessage().catch(console.error)
