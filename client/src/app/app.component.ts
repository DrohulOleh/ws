import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      const potentialToken = localStorage.getItem('auth-token');

      if(potentialToken) {
        this.auth.setToken(potentialToken);
      }
    }
  }
}
