import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPopOverComponent } from 'src/app/confirm-pop-over/confirm-pop-over.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmPopOverComponent;
  let fixture: ComponentFixture<ConfirmPopOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPopOverComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPopOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
