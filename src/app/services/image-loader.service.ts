// src/app/image-loader.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageLoaderService {
  private images: string[] = [
    'assets/images/keyboards/moonlander-white.jpg',
    'assets/images/keyboards/typingmachine.jpg',
    'assets/images/keyboards/random-mechanical-keyboard.jpg',
  ];

  getImages(): string[] {
    return this.images;
  }
}

