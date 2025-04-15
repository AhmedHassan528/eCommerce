import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-unauthorized',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <p class="text-xl text-gray-600 mb-8">Access Denied</p>
        <p class="text-gray-500 mb-8">Sorry, you don't have permission to access this resource.</p>
        <a routerLink="/" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Go Back Home
        </a>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class UnauthorizedComponent {} 