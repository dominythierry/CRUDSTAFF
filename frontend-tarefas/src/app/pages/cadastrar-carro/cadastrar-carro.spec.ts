import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarCarroComponent } from './cadastrar-carro';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('CadastrarCarroComponent', () => {
  let component: CadastrarCarroComponent;
  let fixture: ComponentFixture<CadastrarCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarCarroComponent, FormsModule, HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
