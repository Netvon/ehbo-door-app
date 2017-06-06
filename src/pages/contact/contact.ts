import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private homes: HomeService,
    private sockets: SocketService
    ) {
      this.home = navParams.data

      this.homes.getHomeLiveFeed(this.home._id).subscribe(url => this.liveFeedUrl = url)
      this.homes.getHomeDoorIsOpen(this.home._id).subscribe(isOpen => {
        console.log(isOpen)
        this.doorIsOpen = isOpen
      })

      this.sockets.getDoorMessages(this.home._id).subscribe(args => {
        console.log(args)

        if ( args.home === this.home._id ) {
          this.doorIsOpen = args.doorIsOpen
        }
      })
  }
}
