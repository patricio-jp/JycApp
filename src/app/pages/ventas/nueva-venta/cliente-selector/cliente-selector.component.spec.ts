import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClienteSelectorComponent } from './cliente-selector.component';

describe('ClienteSelectorComponent', () => {
  let component: ClienteSelectorComponent;
  let fixture: ComponentFixture<ClienteSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClienteSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
