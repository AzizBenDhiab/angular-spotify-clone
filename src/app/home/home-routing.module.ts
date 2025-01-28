import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ArtistProfileComponent } from '../components/artist-profile/artist-profile.component';
import { AlbumPageComponent } from '../components/album-page/album-page.component';
import { SearchComponent } from '../components/search/search.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { SavedTrackComponent } from '../components/saved-track/saved-track.component';
import { PlaylistDetailsComponent } from '../components/playlist-details/playlist-details.component';
import { ShowAllComponent } from '../components/show-all/show-all.component';
import { AccueilComponent } from '../components/acceuil/acceuil.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'savedTracks', component: SavedTrackComponent },
      { path: 'playlist/:id', component: PlaylistDetailsComponent },
      { path: 'search/showMore', component: ShowAllComponent },
      { path: 'search', component: SearchComponent },
      { path: 'profile/showMore', component: ShowAllComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'acceuil/showMore', component: ShowAllComponent },
      { path: 'acceuil', component: AccueilComponent },
      { path: "artist/:id", component: ArtistProfileComponent},
      { path: 'album/:id/:artistId', component: AlbumPageComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
