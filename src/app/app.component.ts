import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { initFlowbite } from 'flowbite';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, FontAwesomeModule],
})
export class AppComponent implements OnInit {
  iconsLibrary = inject(FaIconLibrary);

  constructor() {
    this.iconsLibrary.addIconPacks(fas, far, fab);
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
