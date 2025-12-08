import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as RegistroEntradaModule from './registro-entrada';
const RegistroEntrada = RegistroEntradaModule.RegistroVeiculoComponent;

describe('RegistroEntrada', () => {
  let component: any;
  let fixture: ComponentFixture<any>;

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
