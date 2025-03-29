import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoIngresosPage } from './listado-ingresos.page';

describe('ListadoIngresosPage', () => {
  let component: ListadoIngresosPage;
  let fixture: ComponentFixture<ListadoIngresosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoIngresosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
