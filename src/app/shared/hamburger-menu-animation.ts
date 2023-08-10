import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
export const hamburgerAnimation = trigger('hamburguerX', [
  state('hamburguer', style({})),

  state(
    'topX',
    style({
      transform: 'rotate(45deg)',
      transformOrigin: 'left',
      margin: '6px',
    })
  ),
  state(
    'hide',
    style({
      opacity: 0,
    })
  ),
  state(
    'bottomX',
    style({
      transform: 'rotate(-45deg)',
      transformOrigin: 'left',
      margin: '6px',
    })
  ),
  transition('* => *', [animate('0.2s')]),
]);
