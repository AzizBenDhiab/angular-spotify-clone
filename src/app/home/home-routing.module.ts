import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SearchComponent } from '../components/search/search.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { SavedTrackComponent } from '../components/saved-track/saved-track.component';
import { PlaylistDetailsComponent } from '../components/playlist-details/playlist-details.component';

const routes: Routes = [{ path: '', component: HomeComponent, children: [
  { path: 'savedTracks', component: SavedTrackComponent},
  { path: 'playlist/:id', component: PlaylistDetailsComponent},
  { path: 'search', component: SearchComponent },
      { path: 'profile', component: ProfilePageComponent },
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
