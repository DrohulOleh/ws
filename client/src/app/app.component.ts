import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './shared/classes/icon-subset';
import { HttpClientModule } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'WS Client';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private titleService: Title,
    private iconsetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    iconsetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      const potentialToken = localStorage.getItem('auth-token');

      if (potentialToken !== null) {
        this.auth.setToken(potentialToken);
      }
    }
  }
}
