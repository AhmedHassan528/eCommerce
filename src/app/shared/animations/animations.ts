import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// Page transition animation
export const pageTransition = trigger('pageTransition', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translateY(0)' }),
    animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

// Fade in animation for elements
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-out', style({ opacity: 1 }))
  ])
]);

// Stagger animation for lists
export const staggerAnimation = trigger('staggerAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Scale animation for hover effects
export const scaleAnimation = trigger('scaleAnimation', [
  transition(':enter', [
    style({ transform: 'scale(1)' }),
    animate('200ms ease-out', style({ transform: 'scale(1.05)' }))
  ]),
  transition(':leave', [
    style({ transform: 'scale(1.05)' }),
    animate('200ms ease-in', style({ transform: 'scale(1)' }))
  ])
]); 