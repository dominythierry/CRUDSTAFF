import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEntrada } from './registro-entrada';

describe('RegistroEntrada', () => {
  let component: RegistroEntrada;
  let fixture: ComponentFixture<RegistroEntrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEntrada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEntrada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
