import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImageLoaderService } from '../services/image-loader.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MatIconModule
    , MatButtonModule
    , CommonModule
    , MatSelectModule
    , MatFormFieldModule
    , FormsModule
    , ReactiveFormsModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, OnDestroy {
  public options = [
    { value: 'go', label: 'Go', image: 'assets/images/golang-logo.png' },
    { value: 'rust', label: 'Rust', image: 'assets/images/rust-logo.png' },
    { value: 'javascript', label: 'Javascript', image: 'assets/images/javascript-logo.png' },
    { value: 'python', label: 'Python', image: 'assets/images/python-logo.jpg' },
  ];

  public selectedLanguage: string = 'javascript'

  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

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
    }, 5000);
  }

  get currentBackgroundImage(): string {
    return this.images[this.imageIndex];
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getSelectedOption() {
    return this.options.find(option => option.value === this.selectedLanguage) || {
      label: "",
      image: ""
    };
  }
}
