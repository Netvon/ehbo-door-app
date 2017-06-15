import { Component } from '@angular/core'
import { NavController, LoadingController, Loading } from 'ionic-angular'
import { HomeService, IHome } from '../../app/services/home.service'
import { Observable } from 'rxjs/Observable'
import { HomeDetailPage } from '../home-detail/home-detail'

@Component({
  selector: 'page-home-overview',
  templateUrl: 'home-overview.html'
})
export class HomeOverviewPage {

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
    this.navCtrl.push(HomeDetailPage, home)
  }
}
