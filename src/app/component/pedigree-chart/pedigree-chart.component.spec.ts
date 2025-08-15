import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedigreeChartComponent } from './pedigree-chart.component';

describe('PedigreeChartComponent', () => {
  let component: PedigreeChartComponent;
  let fixture: ComponentFixture<PedigreeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedigreeChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedigreeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
