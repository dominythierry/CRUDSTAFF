import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejeitarRegistroComponent } from './rejeitar-registro';

describe('RejeitarRegistro', () => {
  let component: RejeitarRegistroComponent;
  let fixture: ComponentFixture<RejeitarRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejeitarRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejeitarRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
