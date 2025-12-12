import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const lineAnim = () => {
  const targets = document.querySelectorAll(
    '.hero-3_header-wrap, .contact_detail-item, [anim-line], .form_input'
  );
  if (targets.length <= 0) return;
  targets.forEach((target) => {
    const originalTarget = target;
    const solidSides = getSolidBorders(target);
    if (target.classList.contains('form_input')) target = target.closest('.form_field-wrapper');
    if (!target) return;

    const position = gsap.getProperty(target, 'position');
    if (position === 'static') gsap.set(target, { position: 'relative' });
    const lines = addPseudoSides(target, solidSides, originalTarget);
    console.log('b', target, lines);

    lines.forEach(({ line, fromStyles }) => {
      if (!line) return;
      gsap.from(line, {
        // opacity: 0,
        ...fromStyles,
        duration: 0.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: target,
          start: 'top bottom',
        },
      });
    });
  });
};

const getSolidBorders = (el) => {
  const sides = ['top', 'right', 'bottom', 'left'];
  const solidSides = sides.filter((s) => {
    const width = gsap.getProperty(el, `border-${s}-width`);
    const style = gsap.getProperty(el, `border-${s}-style`);
    return width > 0 && style === 'solid';
  });

  // console.log(el, solidSides);
  return solidSides;
};

const addPseudoSides = (target, sides, el) => {
  const allSides = {
    top: {
      width: '100%',
      height: 1,
      top: 0,
      left: 0,
      transformOrigin: 'left',
    },
    right: {
      height: '100%',
      width: 1,
      top: 0,
      right: 0,
      transformOrigin: 'top',
    },
    bottom: {
      width: '100%',
      height: 1,
      bottom: 0,
      left: 0,
      transformOrigin: 'left',
    },
    left: {
      height: '100%',
      width: 1,
      top: 0,
      left: 0,
      transformOrigin: 'top',
    },
  };

  const fromStyles = {
    top: {
      scaleX: 0,
    },

    right: {
      scaleY: 0,
    },

    bottom: {
      scaleX: 0,
    },

    left: {
      scaleY: 0,
    },
  };

  const lines = sides.map((s) => {
    const width = Number(gsap.getProperty(el, `border-${s}-width`));
    if (width <= 0) return { line: null, fromStyles: null };
    const color = gsap.getProperty(el, `border-${s}-color`);
    const line = document.createElement('div');
    line.setAttribute('line', '');
    gsap.set(line, { position: 'absolute', backgroundColor: color });
    gsap.set(line, allSides[s]);
    target.appendChild(line);
    gsap.set(el, { border: 'none' });
    return { line: line, fromStyles: fromStyles[s] };
  });

  return lines;
};
