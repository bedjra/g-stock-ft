import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reappro } from './reappro';

describe('Reappro', () => {
  let component: Reappro;
  let fixture: ComponentFixture<Reappro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reappro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reappro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
