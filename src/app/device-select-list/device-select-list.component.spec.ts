import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSelectListComponent } from './device-select-list.component';

describe('DeviceSelectListComponent', () => {
  let component: DeviceSelectListComponent;
  let fixture: ComponentFixture<DeviceSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
