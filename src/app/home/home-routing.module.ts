import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SearchComponent } from '../components/search/search.component';
import { ArtistProfileComponent } from '../components/artist-profile/artist-profile.component';

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    children: [
      {
        path: "search",
        component: SearchComponent
      },
      {
        path: "search/:item",
        component: SearchComponent
      },
      {
        path: "artist/:id",
        component: ArtistProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
