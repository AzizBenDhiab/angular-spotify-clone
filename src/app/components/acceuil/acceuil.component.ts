import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Artist } from "../../models/artist";
import { SpotifyService } from "../../services/spotify-service.service";
import { ListItemComponent } from "../list-item/list-item.component";
import { CommonModule } from "@angular/common";
import { Song } from "../../models/song";
import { Album } from "../../models/album";

@Component({
    selector: 'app-accueil',
    templateUrl: './acceuil.component.html',
    styleUrls: ['./acceuil.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ListItemComponent,CommonModule],
  })
  export class AccueilComponent implements OnInit {
  
    userTopArtists$!: Observable<Artist[]>;
    newReleases$!: Observable<Album[]>;
  
    constructor(private spotifyService: SpotifyService) {}
  
    ngOnInit(): void {
      this.userTopArtists$ = this.spotifyService.getUserTopArtist();
      this.newReleases$ = this.spotifyService.getNewReleases();
    }
  }