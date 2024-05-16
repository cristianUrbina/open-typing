// src/app/image-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageLoaderService {
  private images: string[] = [
    'assets/images/keyboards/moonlander-white.jpg',
    'assets/images/keyboards/typingmachine.jpg',
    // Add more images here
  ];

  getImages(): string[] {
    return this.images;
  }
}

