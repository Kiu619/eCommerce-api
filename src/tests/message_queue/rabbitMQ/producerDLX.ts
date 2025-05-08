import amqp from 'amqplib'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost:5672')
    const channel = await connection.createChannel()
    
    const notificationExchange = 'notificationExchange'
    const notificationQueue = 'notificationQueueProcess'

    const notificationExchangeDLX = 'notificationExchangeDLX'
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

    // create notification exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true
    })

    // create notification queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      // nếu message bị lỗi sẽ được gửi đến exchange DLX
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })


    // bind notification queue to notification exchange
    await channel.bindQueue(queueResult.queue, notificationExchange, '')
    
    //send message to notification queue
    const message = 'a new product'
    console.log('send message to notification queue', message)
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: '9000'
    })

    // Đảm bảo rằng bạn chỉ đóng kết nối và kênh sau khi gửi tin nhắn
    setTimeout(() => {
      connection.close() // Đóng kết nối sau
    }, 500)

  } catch (error) {
    console.error('Error sending message:', error)
  }
}

runProducer().catch(console.error)
