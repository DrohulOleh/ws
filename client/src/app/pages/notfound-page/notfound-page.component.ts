import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { GridModule } from '@coreui/angular';

@Component({
  selector: 'app-notfound-page',
  standalone: true,
  imports: [GridModule],
  templateUrl: './notfound-page.component.html',
})
export class NotfoundPageComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
