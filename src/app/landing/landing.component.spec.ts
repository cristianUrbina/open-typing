import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { ImageLoaderService } from '../services/image-loader.service';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../app.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockImageLoaderService {
  getImages() {
    return ['mock-image1.png', 'mock-image2.png'];
  }
}

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent, NoopAnimationsModule],
      providers: [
        { provide: ImageLoaderService, useClass: MockImageLoaderService },
        provideRouter([
          { path: '', component: LandingComponent }
        ])

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
