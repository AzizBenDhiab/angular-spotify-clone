import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUserItemComponent } from './menu-user-item.component';

describe('MenuUserItemComponent', () => {
  let component: MenuUserItemComponent;
  let fixture: ComponentFixture<MenuUserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUserItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
