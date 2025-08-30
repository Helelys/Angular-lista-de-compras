import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrice } from './modal-price';

describe('ModalPrice', () => {
  let component: ModalPrice;
  let fixture: ComponentFixture<ModalPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPrice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
