import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosDashboardPage } from './productos-dashboard.page';

describe('ProductosDashboardPage', () => {
  let component: ProductosDashboardPage;
  let fixture: ComponentFixture<ProductosDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
