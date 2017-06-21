import { Component } from '@angular/core'
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular'

import { IHome, HomeService, SocketService } from '../../app/services'

@Component({
	selector: 'page-home-detail',
	templateUrl: 'home-detail.html'
})
export class HomeDetailPage {

	home: IHome
	liveFeedUrl: string = ''
	doorIsOpen = false
	users: any[]

	get lockIcon() {
		if ( this.doorIsOpen ) {
			return 'unlock'
		}

		return 'lock'
	}

	constructor(
		public navCtrl: NavController,
		private navParams: NavParams,
		private homes: HomeService,
		private sockets: SocketService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController
	) {
		this.home = navParams.data

		this.homes.getHomeLiveFeed(this.home._id).subscribe(url => this.liveFeedUrl = url)
		this.homes.getHomeDoorIsOpen(this.home._id).subscribe(isOpen => {
			console.log(isOpen)
			this.doorIsOpen = isOpen
		})

		this.sockets.getDoorMessages(this.home._id).subscribe(args => {
			console.log(args)
			if (args.home === this.home._id) {
				this.doorIsOpen = args.doorIsOpen
			}
		})

		this.homes.getPersons(this.home._id).subscribe(args => {
			this.users = args
		})
	}

	simulatePersonAtTheDoor(id?: string) {
		const loader = this.loadingCtrl.create({
			content: 'Please wait...'
		})

		loader.present()

		this.homes.notifyDoor(this.home._id, id).subscribe(message => {
			loader.dismiss()

			this.alertCtrl.create({
				title: 'Success',
				subTitle: message.msg,
				buttons: ['OK']
			}).present()
		})
	}

	simulatePersonAtTheDoorWithRecognize() {
		const loader = this.loadingCtrl.create({
			content: 'Please wait...'
		})

		loader.present()

		this.homes.recognizePerson(this.home._id).subscribe(response => {

			if ( response.hasOwnProperty('error') ) {
				this.alertCtrl.create({
					title: 'Error',
					subTitle: response['error'],
					buttons: ['OK']
				}).present()

				loader.dismiss()
				return
			}

			console.log(response)

			if (response.persons.length === 0) {
				this.homes.notifyDoor(this.home._id)
			} else {
				for (const person of response.persons) {
					console.dir(person)
					this.homes.notifyDoor(this.home._id, person._id)
				}
				

				this.alertCtrl.create({
					title: 'Found',
					subTitle: response.persons.map(x => `${x.firstName} ${x.lastName}`).join('\n\r'),
					buttons: ['OK']
				}).present()
			}

			loader.dismiss()
		}, error => {
			this.alertCtrl.create({
				title: 'Error',
				subTitle: error.message,
				buttons: ['OK']
			}).present()

			loader.dismiss()
		})
		
	}
}
