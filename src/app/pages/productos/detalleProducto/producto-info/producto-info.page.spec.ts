import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoInfoPage } from './producto-info.page';

describe('ProductoInfoPage', () => {
  let component: ProductoInfoPage;
  let fixture: ComponentFixture<ProductoInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
