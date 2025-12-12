import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const gsapBasicAnimations = () => {
  gsap.set('[anim-slide-in]', { y: 25, opacity: 0 });
  ScrollTrigger.batch('[anim-slide-in]', {
    start: 'top center',
    onEnter: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, duration: 1 }),
  });

  gsap.set('[anim-fade-in]', { opacity: 0 });
  ScrollTrigger.batch('[anim-fade-in]', {
    start: 'top center',
    onEnter: (batch: any) => gsap.to(batch, { opacity: 1, duration: 1 }),
  });

  document.querySelectorAll('[anim-stagger-wrap]').forEach((container) => {
    gsap.from(container.querySelectorAll('[anim-stagger]'), {
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        toggleActions: 'play none none none',
      },
    });
  });
};
