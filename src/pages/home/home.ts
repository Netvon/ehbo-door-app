import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomeService, IHome } from '../../app/services/home.service'
import { Observable } from 'rxjs/Observable'
import { ContactPage } from '../contact/contact'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public homes: Observable<IHome[]>

  constructor(
    public navCtrl: NavController,
    private homeService: HomeService
  ) { }

  ionViewDidLoad() {
    this.homes = this.homeService.getHomes()
  }

  viewHome( home: IHome ) {
    this.navCtrl.push(ContactPage, home)
  }
}
