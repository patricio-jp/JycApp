import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosDashboardPage } from './usuarios-dashboard.page';

describe('UsuariosDashboardPage', () => {
  let component: UsuariosDashboardPage;
  let fixture: ComponentFixture<UsuariosDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
