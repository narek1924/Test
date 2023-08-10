import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
} from '@angular/animations';

export const enterLeaveAnimation = trigger('trigger', [
  transition(
    ':leave',
    animate(
      150,
      keyframes([
        style({ visibility: 'hidden', offset: 0 }),
        style({ height: '0', paddingTop: 0, paddingBottom: 0, offset: 1 }),
      ])
    )
  ),
  transition(':enter', [
    style({ height: 0, paddingTop: 0, paddingBottom: 0 }),
    animate(
      150,
      style({
        height: '*',
        paddingTop: '*',
        paddingBottom: '*',
      })
    ),
  ]),
]);
