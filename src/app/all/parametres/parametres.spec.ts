import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parametres } from './parametres';

describe('Parametres', () => {
  let component: Parametres;
  let fixture: ComponentFixture<Parametres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parametres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Parametres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
