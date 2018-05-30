import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { A002SidebarHeaderComponent } from './a002-sidebar-header.component';

describe('A002SidebarHeaderComponent', () => {
  let component: A002SidebarHeaderComponent;
  let fixture: ComponentFixture<A002SidebarHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ A002SidebarHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(A002SidebarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
