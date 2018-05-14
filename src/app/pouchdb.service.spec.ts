import { TestBed, inject } from '@angular/core/testing';

import { PouchDBService } from './pouchdb.service';

describe('PouchDBService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PouchDBService]
    });
  });

  it('should be created', inject([PouchDBService], (service: PouchDBService) => {
    expect(service).toBeTruthy();
  }));
});
