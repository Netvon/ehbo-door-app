import { Component } from '@angular/core'

import { HomeOverviewPage } from '../home-overview/home-overview'

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = HomeOverviewPage
}
