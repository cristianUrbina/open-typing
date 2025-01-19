import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-custom-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss'
})
export class CustomCardComponent {
  @Input()
  title: string | undefined;
  @Input()
  text: string | undefined;
  @Input()
  imageUrl: string | undefined;
}
