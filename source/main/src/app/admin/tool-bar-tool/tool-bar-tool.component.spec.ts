import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBarToolComponent } from './tool-bar-tool.component';

describe('ToolBarToolComponent', () => {
  let component: ToolBarToolComponent;
  let fixture: ComponentFixture<ToolBarToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolBarToolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolBarToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
