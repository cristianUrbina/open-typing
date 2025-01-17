import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingEditorComponent } from './typing-editor.component';

describe('TypingEditorComponent', () => {
  let component: TypingEditorComponent;
  let fixture: ComponentFixture<TypingEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
