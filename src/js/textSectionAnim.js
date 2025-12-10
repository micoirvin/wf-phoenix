import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { removeFalsy } from './removeFalsy';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
import { safeGsap } from './safeGsap';

window.gsap = gsap;

export const textSectionAnim = () => {
  function Selector(
    wrap = null,
    text = null,
    side = null,
    accentLine = null,
    accentIcon = null,
    ignoreNotchGlowAttr = null
  ) {
    this.wrap = wrap;
    this.text = text;
    this.side = side;
    this.accentLine = accentLine;
    this.accentIcon = accentIcon;
    this.ignoreNotchGlowAttr = ignoreNotchGlowAttr;
  }
  const selectors = [
    new Selector(
      '.section_hero',
      'p[class*="heading-style"]',
      null,
      '.hero_accent-line',
      '.hero_accent-icon',
      '[data-wf--hero--variant="brand"]'
    ),
    new Selector('.section', 'p[class*="heading-style"]', '.s-head-2_text', null, null),
  ];

  let tls = [];
  let splits = [];

  const initAnims = () => {
    tls.forEach((tl) => tl.revert());
    splits.forEach((split) => split.revert());
    splits = [];
    tls = [];
    selectors.forEach((selector) => {
      const { wrap } = selector;
      const wrapEls = document.querySelectorAll(wrap);
      wrapEls.forEach((wrapEl) => initAnimsPerWrap(wrapEl, selector));
    });
  };

  const initAnimsPerWrap = (wrapEl, selector) => {
    const { text, side, accentLine, accentIcon, ignoreNotchGlowAttr } = selector;
    const textEl = wrapEl.querySelector(text);
    const sideEl = side ? wrapEl.querySelector(side) : null;
    const eyebrowTextEl = wrapEl.querySelector('.eyebrow .text-tag');
    const eyebrowIconEl = wrapEl.querySelector('.eyebrow_icon');
    const accentLineEl = accentLine ? wrapEl.querySelectorAll(accentLine) : null;
    const accentIconEl = accentIcon ? wrapEl.querySelectorAll(accentIcon) : null;

    let split = new SplitText(textEl, {
      type: ['lines'],
    });

    splits.push(split);

    const linesSplits = split.lines.map((line) => {
      const lineSplit = new SplitText(line, {
        type: 'words,chars',
      });
      splits.push(lineSplit);
      return {
        line: line,
        lineSplit: lineSplit,
      };
    });

    gsap.set(
      removeFalsy([
        eyebrowIconEl,
        eyebrowTextEl,
        sideEl,
        accentLineEl,
        accentIconEl,
        ...split.lines,
      ]),
      {
        opacity: 0,
      }
    );

    gsap.set(accentLineEl, {
      scaleX: 0,
      transformOrigin: 'left',
    });

    linesSplits.forEach(({ line, lineSplit }) => {
      gsap.set(lineSplit.chars, { opacity: 0.4 });
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapEl,
        start: 'top center',
        end: 'bottom center',
        // markers: true,
        toggleActions: 'play none none none',
        once: true,
      },
    });
    tls.push(tl);

    let linesStartOverlap = '+=0';
    if (eyebrowTextEl) {
      if (wrapEl.closest(ignoreNotchGlowAttr) === null) {
        tl.to(eyebrowIconEl, { opacity: 1, ease: 'power3.in', duration: 0.5 });
        tl.to(eyebrowIconEl, {
          color: 'var(--color-scheme-1--brand)',
          ease: 'power3.out',
          duration: 0.5,
        });
        tl.to(eyebrowTextEl, { opacity: 1, ease: 'power3.in', duration: 0.5 });
      } else {
        tl.to([eyebrowIconEl, eyebrowTextEl], {
          opacity: 1,
          ease: 'power3.in',
          duration: 0.5,
        });
      }
    }

    tl.to(
      split.lines,
      {
        opacity: 1,
        ease: 'power1.in',
        duration: 0.5,
      },
      linesStartOverlap
    );

    linesSplits.forEach(({ line, lineSplit }, i) => {
      let overlap = '-=0.2';
      if (i === 0) overlap = '+=0.3';
      tl.to(
        lineSplit.chars,
        {
          opacity: 1,
          stagger: {
            each: 0.01,
            ease: 'power3.in',
          },
        },
        overlap
      );
    });

    if (sideEl)
      tl.to(
        sideEl,
        {
          opacity: 1,
          ease: 'power3.in',
          duration: 0.5,
        },
        '-=0.3'
      );

    if (accentLineEl)
      tl.to(
        accentLineEl,
        {
          opacity: 1,
          scaleX: 1,
          ease: 'power3.in',
          duration: 0.5,
        },
        '-=0.3'
      );
    if (accentIconEl)
      tl.to(accentIconEl, {
        opacity: 1,
        ease: 'power3.in',
        duration: 0.5,
      });
  };

  initAnims();

  const debouncer = gsap.delayedCall(0.2, initAnims).pause();

  window.addEventListener('resize', () => debouncer.restart(true));
};
