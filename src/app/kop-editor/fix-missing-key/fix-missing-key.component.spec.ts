import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixMissingKeyComponent } from 'src/app/kop-editor/fix-missing-key/fix-missing-key.component';

describe('FixMissingKeyComponent', () => {
  let component: FixMissingKeyComponent;
  let fixture: ComponentFixture<FixMissingKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixMissingKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixMissingKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
