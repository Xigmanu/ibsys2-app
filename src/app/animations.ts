// animations.ts
import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  // Transition when a route changes
  transition('* <=> *', [
    style({
      opacity: 0,
      transform: 'translateY(-4px)', // Start slightly above the final position
    }),
    animate(
      '500ms cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease-in-out effect
      style({
        opacity: 1,
        transform: 'translateY(0)', // End at the final position
      })
    ),
  ]),
]);
