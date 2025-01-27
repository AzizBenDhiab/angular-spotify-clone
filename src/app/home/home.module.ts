import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RightPanelComponent } from '../components/right-panel/right-panel.component';
import { LeftPanelComponent } from '../components/left-panel/left-panel.component';
import { SavedTrackComponent } from '../components/saved-track/saved-track.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RightPanelComponent,
    LeftPanelComponent, 
    SavedTrackComponent
  ]
})
export class HomeModule { }
