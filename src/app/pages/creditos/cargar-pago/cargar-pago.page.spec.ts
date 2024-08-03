import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargarPagoPage } from './cargar-pago.page';

describe('CargarPagoPage', () => {
  let component: CargarPagoPage;
  let fixture: ComponentFixture<CargarPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
