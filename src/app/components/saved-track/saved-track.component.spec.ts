import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTrackComponent } from './saved-track.component';

describe('SavedTrackComponent', () => {
  let component: SavedTrackComponent;
  let fixture: ComponentFixture<SavedTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
