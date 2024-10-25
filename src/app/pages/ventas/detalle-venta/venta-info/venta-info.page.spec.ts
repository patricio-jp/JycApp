import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaInfoPage } from './venta-info.page';

describe('VentaInfoPage', () => {
  let component: VentaInfoPage;
  let fixture: ComponentFixture<VentaInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
