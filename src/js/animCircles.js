import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { img2svg } from './img2svg';
export const animCircles = async () => {
  let svgs = document.querySelectorAll('[anim-circles]');
  svgs.forEach(async (svg) => {
    const glow = svg.hasAttribute('anim-circles-glow');
    svg = await img2svg(svg);
    const circles = svg.querySelectorAll('g[clip-path] path');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top center',
      },
    });

    tl.from(circles, {
      opacity: 0,
      scale: 0,
      duration: 1,
      ease: 'power3.inOut',
    });

    if (glow)
      tl.from(circles, {
        fill: gsap.getProperty(svg.parentElement, 'color'),
        ease: 'power3.inOut',
      });
  });
};
