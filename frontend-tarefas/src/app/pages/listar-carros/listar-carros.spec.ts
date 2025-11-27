import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCarros } from './listar-carros';

describe('ListarCarros', () => {
  let component: ListarCarros;
  let fixture: ComponentFixture<ListarCarros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCarros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCarros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
