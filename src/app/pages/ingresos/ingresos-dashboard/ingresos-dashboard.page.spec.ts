import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresosDashboardPage } from './ingresos-dashboard.page';

describe('IngresosDashboardPage', () => {
  let component: IngresosDashboardPage;
  let fixture: ComponentFixture<IngresosDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresosDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
