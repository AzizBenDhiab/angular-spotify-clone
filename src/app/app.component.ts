import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthentificationInterceptorProvider } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [
    AuthentificationInterceptorProvider,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-spotify-clone';
}
