import { greetUser } from '$utils/greet';
import { textSectionAnim } from './js/textSectionAnim';
import { navColor } from './js/navColor';
import { modals } from './js/modals';
import { crosshairModals } from './js/crosshairModals';
import { introAnim } from './js/introAnim';
window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Phoenix';
  greetUser(name);

  introAnim();
  textSectionAnim();
  navColor();
  modals();
  crosshairModals();
});
