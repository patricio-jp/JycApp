import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoCreditosPage } from './listado-creditos.page';

describe('ListadoCreditosPage', () => {
  let component: ListadoCreditosPage;
  let fixture: ComponentFixture<ListadoCreditosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCreditosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
