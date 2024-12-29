import { Component, inject, Input } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonIcon,
  PopoverController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
})
export class PopoverComponent {
  @Input() data: any;

  constructor() {}

  private popoverController = inject(PopoverController);

  dismiss(data?: any) {
    this.popoverController.dismiss(data);
  }

  onAction(action: string) {
    this.dismiss({ action });
  }
}
