import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovarRegistroComponent } from './aprovar-registro';

describe('AprovarRegistro', () => {
  let component: AprovarRegistroComponent;
  let fixture: ComponentFixture<AprovarRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovarRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprovarRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
