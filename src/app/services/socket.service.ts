import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket

	constructor() {
		this.socket = io('https://ehboapi.herokuapp.com/')
	}

    getDoorMessages( homeId: string ): Observable<IDoorMessage> {
        return new Observable(s => {

            this.socket.emit('add open door', homeId)

            this.socket.on('open door', (data: string) => {
                const args = data.split(',')

                s.next({ home: args[1], doorIsOpen: args[0] === 'true' })
            })

            return () => {
                this.socket.disconnect()
            }
        })
    }

	getMessages(): Observable<string> {
        return new Observable(s => {

            this.socket.on('message', (data: string) => {
                s.next(data)
            })

            return () => {
                this.socket.disconnect()
            }
        })
    }
}

export interface IDoorMessage {
    home: string
    doorIsOpen: boolean
}
