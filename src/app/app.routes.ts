import { Routes } from '@angular/router';
import { TypingSessionComponent } from './typing-session/typing-session.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }
  , { path: 'typing-session', component: TypingSessionComponent }
];
