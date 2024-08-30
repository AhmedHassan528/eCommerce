import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucceedComponent } from './succeed.component';

describe('SucceedComponent', () => {
  let component: SucceedComponent;
  let fixture: ComponentFixture<SucceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
