import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryPageComponent } from './data-entry-page.component';

describe('DataEntryPageComponent', () => {
  let component: DataEntryPageComponent;
  let fixture: ComponentFixture<DataEntryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataEntryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
