import { Http } from '@angular/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/timeout'

@Injectable()
export class HomeService {
	private baseUrl = 'https://ehboapi.herokuapp.com/api'

	constructor(private http: Http) { }

	getHomes(): Observable<IHome[]> {
		return this.http.get(`${this.baseUrl}/homes`).map(res => res.json() as IHome[])
	}

	getHomeLiveFeed(homeId: string): Observable<string> {
		return this.http.get(`${this.baseUrl}/homes/${homeId}/live-feed`).map(res => res.json().url)
	}

	getHomeDoorIsOpen(homeId: string): Observable<boolean> {
		return this.http.get(`${this.baseUrl}/homes/${homeId}/door`).map(res => res.json().doorIsOpen)
	}

	openDoor(homeId: string): Observable<{ _id: string, isDoorOpen: boolean }> {
		return this.http.post(`${this.baseUrl}/homes/${homeId}/door`, { duration: 5 })
			.map(res => res.json())
	}

	notifyDoor(homeId: string, personId: string = null): Observable<any> {
		return this.http.post(`${this.baseUrl}/homes/${homeId}/notify-door`, { personId })
			.map(res => res.json())
	}

	recognizePerson(homeId: string) {
		return this.http.get(`${this.baseUrl}/homes/${homeId}/recognize-person`)
			.timeout(30000)
			.map(res => {
				console.log(res)
				return res.json() as IVisit
			})
	}
}

export interface IHome {
	_id: string
	postalCode: string
	number: string
	persons: IPerson[]
	doorIsOpen: boolean
	liveFeedUrl: string
}

export interface IPerson {
	_id: string
	firstName: string
	lastName: string
	description: string
}

export interface IVisit {
	mimetype: string
	persons: IPerson[]
	takeOn: Date
	_id: string
}