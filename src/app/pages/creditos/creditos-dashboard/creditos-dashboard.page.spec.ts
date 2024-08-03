import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditosDashboardPage } from './creditos-dashboard.page';

describe('CreditosDashboardPage', () => {
  let component: CreditosDashboardPage;
  let fixture: ComponentFixture<CreditosDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
