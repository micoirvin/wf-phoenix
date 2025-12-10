import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const navColor = () => {
  const selectors = '.section, section';
  const sections = document.querySelectorAll(selectors);
  const nav = document.querySelector('.header .nav_bar');
  sections.forEach((section) => {
    const color = getComputedStyle(section).color;
    const change = () => gsap.to(nav, { color: color, duration: 0.3, ease: 'power1.out' });
    const elsWithTrans = nav.querySelectorAll('a, svg');
    gsap.set(elsWithTrans, { transition: 'inherit' });

    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=10',
      end: 'bottom top',
      onEnter: change,
      onEnterBack: change,
    });
  });
};
