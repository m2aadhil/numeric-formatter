import { TestBed } from '@angular/core/testing';

import { NumericFormatterService } from './numeric-formatter.service';

describe('NumericFormatterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NumericFormatterService = TestBed.get(NumericFormatterService);
    expect(service).toBeTruthy();
  });
});
