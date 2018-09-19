import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditableComponent } from 'src/app/content-editable/content-editable.component';

describe('ContentEditableComponent', () => {
  let component: ContentEditableComponent;
  let fixture: ComponentFixture<ContentEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
