import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SavedTrackComponent } from '../components/saved-track/saved-track.component';
import { PlaylistDetailsComponent } from '../components/playlist-details/playlist-details.component';

const routes: Routes = [{ path: '', component: HomeComponent , children: [
  { path: 'savedTracks', component: SavedTrackComponent},
  { path: 'playlist/:id', component: PlaylistDetailsComponent}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
