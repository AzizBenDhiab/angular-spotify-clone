import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { spotifyConfiguration } from '../../environments/environment';
import { SpotifyUser } from '../shared/helpers/SpotifyHelper';
import { User } from '../models/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public currentUser = signal<User | null>(null);
  public isLogged = computed(() => !!this.currentUser());
  private spotifyApiUrl = spotifyConfiguration.spotifyApiBaseUrl;

  constructor(private router: Router, private http: HttpClient) {
    this.initializeUserSession();
  }

  private initializeUserSession(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
          this.currentUser.set(JSON.parse(storedUser));
          this.startTokenExpirationTimer();
        }
      } catch (error) {
        console.error('Session restoration error:', error);
        this.logout();
      }
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
    if (typeof window === 'undefined') return '';
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
    if (!token) return;

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

  private async verifyToken(token: string): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.get(`${this.spotifyApiUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
  private getSpotifyUser(): void {
    const token = localStorage.getItem('access_token');
    if (!token) return this.logout();

    this.http
      .get<any>(`${this.spotifyApiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (userInfo) => {
          if (userInfo && (userInfo.display_name || userInfo.id)) {
            const user = SpotifyUser(userInfo);
            this.currentUser.set(user);
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['home']);
          } else {
            console.error('Incomplete user info');
            this.logout();
          }
        },
        error: (error: HttpErrorResponse) => this.handleApiError(error),
      });
  }

  private handleApiError(error: HttpErrorResponse): void {
    console.error('Spotify API Error:', error);
    this.logout();
  }

  logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
    console.log('Logged out');
    this.router.navigate(['home']);
  }
}
