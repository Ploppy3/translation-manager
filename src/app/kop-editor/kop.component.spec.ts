import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopEditorComponent } from 'src/app/json-editor/kop.component';

describe('JsonEditorComponent', () => {
  let component: KopEditorComponent;
  let fixture: ComponentFixture<KopEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KopEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
