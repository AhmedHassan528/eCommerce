import { TestBed } from '@angular/core/testing';

import { FlowbiteServiceTsService } from './flowbite.service.ts.service';

describe('FlowbiteServiceTsService', () => {
  let service: FlowbiteServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowbiteServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
