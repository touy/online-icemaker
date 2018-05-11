import { TestBed, inject } from '@angular/core/testing';

import { WebsocketDataServiceService } from './websocket-data-service.service';

describe('WebsocketDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketDataServiceService]
    });
  });

  it('should be created', inject([WebsocketDataServiceService], (service: WebsocketDataServiceService) => {
    expect(service).toBeTruthy();
  }));
});
