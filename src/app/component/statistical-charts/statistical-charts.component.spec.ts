import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalChartsComponent } from './statistical-charts.component';

describe('StatisticalChartsComponent', () => {
  let component: StatisticalChartsComponent;
  let fixture: ComponentFixture<StatisticalChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
