import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesDashboardPage } from './clientes-dashboard.page';

describe('ClientesDashboardPage', () => {
  let component: ClientesDashboardPage;
  let fixture: ComponentFixture<ClientesDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
