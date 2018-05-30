import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { A001TopHeaderComponent } from './a001-top-header.component';

describe('A001TopHeaderComponent', () => {
  let component: A001TopHeaderComponent;
  let fixture: ComponentFixture<A001TopHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ A001TopHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(A001TopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
