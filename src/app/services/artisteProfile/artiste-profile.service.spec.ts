import { TestBed } from '@angular/core/testing';

import { ArtisteProfileService } from './artiste-profile.service';

describe('ArtisteProfileService', () => {
  let service: ArtisteProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtisteProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
