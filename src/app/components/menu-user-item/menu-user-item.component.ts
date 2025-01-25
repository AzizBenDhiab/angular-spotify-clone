import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { Artist } from '../../models/artist';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-menu-user-item',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './menu-user-item.component.html',
  styleUrl: './menu-user-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuUserItemComponent{
  @Input() user!: User | Artist;
}
