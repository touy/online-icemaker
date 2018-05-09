import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixChartComponent } from './mix-chart.component';

describe('MixChartComponent', () => {
  let component: MixChartComponent;
  let fixture: ComponentFixture<MixChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
