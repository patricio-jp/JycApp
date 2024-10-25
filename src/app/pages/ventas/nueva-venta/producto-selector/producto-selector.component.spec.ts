import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductoSelectorComponent } from './producto-selector.component';

describe('ProductoSelectorComponent', () => {
  let component: ProductoSelectorComponent;
  let fixture: ComponentFixture<ProductoSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductoSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
