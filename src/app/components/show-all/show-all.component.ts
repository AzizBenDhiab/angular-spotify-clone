import { Component, Input, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Playlist } from '../../models/playlist';
import { Artist } from '../../models/artist';
import { Album } from '../../models/spotifySearch';
import { PlayerService } from '../../services/player.service';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpotifyCardComponent } from '../spotify-card/spotify-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [FontAwesomeModule,SpotifyCardComponent,CommonModule],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.css'
})
export class ShowAllComponent {
  @Input() items$!: Observable<User[] | Playlist[] | Artist[] | Album[] | null>;
  @Input() shouldApplyRoundedClass: boolean = false;
  angle = faAngleLeft;
  constructor(
    public playerService: PlayerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  

  previous() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
  isArtist(item: any): boolean {
    return item && 'followers' in item;
  }

}
