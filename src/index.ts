import { greetUser } from '$utils/greet';
import { textSectionAnim } from './js/textSectionAnim';
import { navColor } from './js/navColor';
import { modals } from './js/modals';
import { crosshairModals } from './js/crosshairModals';
import { introAnim } from './js/introAnim';
import { slidesAnim } from './js/slidesAnim';
import { gsapBasicAnimations } from './js/gsapBasicAnimations';
import { swiperSliders } from './js/swiperSliders';
import { accordions } from './js/accordions';
import { animCircles } from './js/animCircles';
import { solutionParticles } from './js/solutionParticles';
import { lineAnim } from './js/lineAnim';
window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Phoenix';
  greetUser(name);

  document.documentElement.classList.add('ready');

  setTimeout(() => {
    introAnim();
    textSectionAnim();
    lineAnim();
    animCircles();
    gsapBasicAnimations();
    navColor();
    slidesAnim();
    solutionParticles();
    modals();
    crosshairModals();
    swiperSliders();
    accordions();
  }, 0);
});
