import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SearchComponent } from '../components/search/search.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { DummyAddSongComponent } from '../components/test/test.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'search', component: SearchComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'test', component: DummyAddSongComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
