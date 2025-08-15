import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDetailPageComponent } from './plant-detail-page.component';

describe('PlantDetailPageComponent', () => {
  let component: PlantDetailPageComponent;
  let fixture: ComponentFixture<PlantDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
