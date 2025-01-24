import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { spotifyConfiguration } from '../../environments/environment';
import { SpotifyUser } from '../shared/helpers/SpotifyHelper';
import { User } from '../models/user';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLogged$: Observable<boolean> = this.currentUserSubject.pipe(
    map((user) => !!user)
  );
  private spotifyApiUrl = spotifyConfiguration.spotifyApiBaseUrl;

  constructor(private router: Router, private http: HttpClient) {
    this.initializeUserSession();
  }

  private initializeUserSession(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
          this.currentUserSubject.next(JSON.parse(storedUser));
          this.startTokenExpirationTimer();
        }
      }
    } catch (error) {
      console.error('Session restoration error:', error);
      this.logout();
    }
  }

  private startTokenExpirationTimer(): void {
    const expirationTime = parseInt(
      localStorage.getItem('expires_at') || '0',
      10
    );
    const expiresIn = expirationTime - Date.now();

    if (expiresIn > 0) {
      setTimeout(() => this.logout(), expiresIn);
    } else {
      this.logout();
    }
  }

  getLoginUrl(): string {
    const params = new URLSearchParams({
      client_id: spotifyConfiguration.clientId,
      redirect_uri: spotifyConfiguration.redirectUrl,
      scope: spotifyConfiguration.scopes.join(' '),
      response_type: 'token',
      show_dialog: 'true',
    });

    return `${spotifyConfiguration.authEndpoint}?${params.toString()}`;
  }

  private getTokenFromHash(): string {
    if (typeof window == 'undefined') return '';
    if (!window.location.hash) return '';

    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');

    if (!token) {
      console.error('No access token found in URL hash');
      return '';
    }

    console.log('Token received:', token.substring(0, 5) + '...');
    return token;
  }

  handleLogin(): void {
    const token = this.getTokenFromHash();

    if (!token) {
      console.log('No token found in hash');
      return;
    }

    localStorage.setItem('access_token', token);
    localStorage.setItem(
      'expires_at',
      (Date.now() + (3600 - 60) * 1000).toString()
    );

    this.verifyToken(token).then((isValid) => {
      if (isValid) {
        this.startTokenExpirationTimer();
        this.getSpotifyUser();
      } else {
        console.error('Invalid token received');
        this.logout();
      }
    });
  }

  private verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http
        .get(`${this.spotifyApiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          map(() => true),
          catchError((error) => {
            console.error('Token verification failed:', error);
            return of(false);
          })
        )
        .subscribe((isValid) => resolve(isValid));
    });
  }

  private getSpotifyUser(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No access token available');
      this.logout();
      return;
    }

    this.http
      .get<any>(`${this.spotifyApiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Spotify API Error:', error);

          if (error.status === 403) {
            console.log(
              'Authorization failed. Token:',
              token.substring(0, 5) + '...'
            );
            console.log('Full error:', error);
          }
          console.log('this get caused log out');
          this.logout();
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (userInfo) => {
          if (!userInfo) {
            console.error('No user info received');
            return;
          }
          const user = SpotifyUser(userInfo);
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['login']);
        },
        error: (error) => {
          console.error('Subscription error:', error);
          this.logout();
        },
      });
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    console.log('loged out');
    this.router.navigate(['login']);
  }
}
