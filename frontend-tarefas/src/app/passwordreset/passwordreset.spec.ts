import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Passwordreset } from './passwordreset';

describe('Passwordreset', () => {
  let component: Passwordreset;
  let fixture: ComponentFixture<Passwordreset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Passwordreset]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Passwordreset);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
