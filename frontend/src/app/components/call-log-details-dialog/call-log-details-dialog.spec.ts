import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogDetailsDialog } from './call-log-details-dialog';

describe('CallLogDetailsDialog', () => {
  let component: CallLogDetailsDialog;
  let fixture: ComponentFixture<CallLogDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallLogDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
