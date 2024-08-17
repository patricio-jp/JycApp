import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoVentasPage } from './listado-ventas.page';

describe('ListadoVentasPage', () => {
  let component: ListadoVentasPage;
  let fixture: ComponentFixture<ListadoVentasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
