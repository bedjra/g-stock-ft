import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inventaire } from './inventaire';

describe('Inventaire', () => {
  let component: Inventaire;
  let fixture: ComponentFixture<Inventaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inventaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inventaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
