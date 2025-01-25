import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [],
})
export class LoginComponent implements OnInit {
  private loginService = inject(LoginService);
  private router = inject(Router);
  ngOnInit(): void {
    if (!this.loginService.isLogged()) {
      this.loginService.handleLogin();
    } else {
      this.router.navigate(['home']);
    }
  }

  Login() {
    window.location.href = this.loginService.getLoginUrl();
  }
}
