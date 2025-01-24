import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

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
    this.loginService.handleLogin();
  }

  Login() {
    window.location.href = this.loginService.getLoginUrl();
  }
}
