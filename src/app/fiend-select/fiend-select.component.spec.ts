import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiendSelectComponent } from './fiend-select.component';

describe('FiendSelectComponent', () => {
  let component: FiendSelectComponent;
  let fixture: ComponentFixture<FiendSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiendSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiendSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
