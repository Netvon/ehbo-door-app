import { Component } from '@angular/core'
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular'
import { IHome, HomeService } from '../../app/services/home.service'
import { SocketService } from '../../app/services/socket.service'

@Component({
	selector: 'page-contact',
	templateUrl: 'contact.html'
})
export class ContactPage {

	home: IHome
	liveFeedUrl: string = ''
	doorIsOpen = false

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
	}

	simulatePersonAtTheDoor() {
		const loader = this.loadingCtrl.create({
			content: 'Please wait...'
		})

		loader.present()

		this.homes.notifyDoor(this.home._id).subscribe(message => {
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

		this.homes.recognizePerson(this.home._id).subscribe(persons => {

			console.log(persons)

			if (!persons) {
				this.homes.notifyDoor(this.home._id)
			} else {
				for (const person of persons) {
					this.homes.notifyDoor(this.home._id, person._id)
				}
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
