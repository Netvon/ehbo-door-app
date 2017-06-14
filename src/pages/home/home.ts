import { Component } from '@angular/core'
import { NavController, LoadingController, Loading } from 'ionic-angular'
import { HomeService, IHome } from '../../app/services/home.service'
import { Observable } from 'rxjs/Observable'
import { ContactPage } from '../contact/contact'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public homes: Observable<IHome[]>
  private loader: Loading

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private homeService: HomeService
  ) { }

  ionViewDidLoad() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    })
    this.loader.present()

    this.homes = this.homeService.getHomes()
    this.homes.subscribe(x => this.loader.dismiss())
  }

  viewHome(home: IHome) {
    this.navCtrl.push(ContactPage, home)
  }
}
