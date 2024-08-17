import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasDashboardPage } from './ventas-dashboard.page';

describe('VentasDashboardPage', () => {
  let component: VentasDashboardPage;
  let fixture: ComponentFixture<VentasDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
