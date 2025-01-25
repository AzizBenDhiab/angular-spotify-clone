import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {
  constructor(private router: Router) {}

  @Input() contenu = ''; // Input for the button label
  @Input() routerLink: string | any[] = []; // Input for the router link
}
