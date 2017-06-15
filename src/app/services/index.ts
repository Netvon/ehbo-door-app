export * from './home.service'
export * from './socket.service'

import { HomeService } from './home.service'
import { SocketService } from './socket.service'

export const services = [
	HomeService,
	SocketService
]