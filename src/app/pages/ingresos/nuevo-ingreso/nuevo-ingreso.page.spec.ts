import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoIngresoPage } from './nuevo-ingreso.page';

describe('NuevoIngresoPage', () => {
  let component: NuevoIngresoPage;
  let fixture: ComponentFixture<NuevoIngresoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
