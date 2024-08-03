import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCreditoPage } from './detalle-credito.page';

describe('DetalleCreditoPage', () => {
  let component: DetalleCreditoPage;
  let fixture: ComponentFixture<DetalleCreditoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCreditoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
