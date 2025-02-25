import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RightPanelComponent } from '../components/right-panel/right-panel.component';
import { LeftPanelComponent } from '../components/left-panel/left-panel.component';
import { SearchComponent } from '../components/search/search.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { SavedTrackComponent } from '../components/saved-track/saved-track.component';
import { AccueilComponent } from '../components/acceuil/acceuil.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RightPanelComponent,
    LeftPanelComponent,
    SearchComponent,
    ProfilePageComponent,
    SavedTrackComponent,
    AccueilComponent,
  ],
})
export class HomeModule {}
