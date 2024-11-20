import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { provideHttpClient } from '@angular/common/http';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
