import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImageLoaderService } from '../services/image-loader.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, OnDestroy {
  private imageIndex: number = 0;
  private intervalId: any;
  images: string[] = [];

  constructor(private imageLoaderService: ImageLoaderService) { }

  ngOnInit(): void {
    this.images = this.imageLoaderService.getImages();
    this.startImageRotation();
  }

  startImageRotation(): void {
    this.intervalId = setInterval(() => {
      this.imageIndex = (this.imageIndex + 1) % this.images.length;
    }, 2000); // Change image every 5 seconds
  }

  get currentBackgroundImage(): string {
    return this.images[this.imageIndex];
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
