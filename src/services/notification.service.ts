import notificationModel from "~/models/notification.model"

class NotificationService {
    static pushNotificationToSystem = async ({
      type = 'SHOP-001', receiverId = '1', senderId = '1', options = {}
    }: {
      type: string,
      receiverId: string,
      senderId: string,
      options: object
    }) => {
        let noti_content

        if (type === 'SHOP-001') {
          noti_content = `Shop gì gì đấy vừa thêm một sản phẩm gì gì đấy`
        } else if (type === 'PROMOTION-001') {
          noti_content = `Shop gì gì đấy vừa thêm một voucher gì gì đấy`
        }

        const newNotification = await notificationModel.create({
          noti_type: type,
          noti_senderId: senderId,
          noti_receiverId: receiverId,
          noti_content: noti_content,
          noti_options: options
        })

        return newNotification
    }

    static listNotiByUser = async ({
      userId = '1', type = 'ALL', isRead = 0
    }: {
      userId: string,
      type?: string,
      isRead?: number
    }) => {
      const match: { noti_receiverId: string; noti_type?: string } = { noti_receiverId: userId }
      if (type !== 'ALL') match.noti_type = type

      return await notificationModel.aggregate([
        {
          $match: match
        },
        {
          $project: {
            noti_type: 1,
            noti_senderId: 1,
            noti_receiverId: 1,
            noti_content: 1,
            createAt: 1
          }
        }
      ])
    }
}

export default NotificationService

