import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pdv } from './pdv';

describe('Pdv', () => {
  let component: Pdv;
  let fixture: ComponentFixture<Pdv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pdv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pdv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
