// import { NextFunction, Request, Response } from 'express'
// import LoggerService from '~/loggers/discord.log.v2'

// const pushToLogDiscord = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     LoggerService.sendMessage(req.get('host') + req.originalUrl + '\n' + JSON.stringify(req.body))

//     return next()
//   } catch (error) {
//     console.log(error)
//   }
// }

// export { pushToLogDiscord }