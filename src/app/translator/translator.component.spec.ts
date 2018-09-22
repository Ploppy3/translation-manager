import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorComponent } from 'src/app/translator/translator.component';

describe('TranslatorComponent', () => {
  let component: TranslatorComponent;
  let fixture: ComponentFixture<TranslatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TranslatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
