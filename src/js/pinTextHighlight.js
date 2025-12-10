import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger);

export const pinTextHighlight = () => {
  const textSelectors = '.section_hero h2';
  const wrapperSelectors = '.section_hero';
  let split, tl;

  const createSplit = () => {
    document.querySelectorAll(wrapperSelectors).forEach((wrapperEl) => {
      const textEl = wrapperEl.querySelector(textSelectors);
      const wrapperHeight = wrapperEl.getBoundingClientRect().height;
      const triggerStart = -window.innerHeight / 4;
      const triggerEnd = window.innerHeight - wrapperHeight;
      if (!textEl) return;
      split && split.revert();
      tl && tl.revert();
      split = new SplitText(textEl, {
        type: 'chars',
      });

      gsap.set(split.chars, { opacity: 0.4 });

      tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapperEl,
            start: `top+=${triggerStart} top`,
            end: `bottom+=${triggerEnd} top`,
            pin: false,
            scrub: 0.75,
            markers: true,
          },
        })
        .set(
          split.chars,
          {
            opacity: 1,
            stagger: 0.05,
          },
          0.05
        );
    });
  };
  createSplit();
  const debouncer = gsap.delayedCall(0.2, createSplit).pause();

  window.addEventListener('resize', () => debouncer.restart(true));
};
