import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { colorsEqual } from './colorsEqual';

let didLogoColorChange = false;
const brandColor = gsap.getProperty(':root', '--color-scheme-1--brand');

export const navColor = () => {
  const selectors = '.section, section, [nav-color-include]';
  const sections = document.querySelectorAll(selectors);
  const nav = document.querySelector('.header .nav_bar');
  const header = document.querySelector('.header');

  sections.forEach((section, i) => {
    if (section.hasAttribute('nav-color-ignore')) return;
    // if (section.classList.contains('section_intro')) return;
    const color = gsap.getProperty(section, 'color');
    const borderColor = gsap.getProperty(section, '--color-scheme-1--border-grey');
    const change = () => {
      gsap.to(nav, { color: color, duration: 0.3, ease: 'power3.inOut' });
      gsap.to([header, nav], {
        '--color-scheme-1--border-grey': borderColor,
        duration: 0.3,
        ease: 'power3.inOut',
      });
      debouncer(() => initialNavColorChange(color, section));
    };
    const elsWithTrans = nav.querySelectorAll('a, svg');
    gsap.set(elsWithTrans, { transition: 'inherit' });
    console.log(section);

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      pin: false,
      onEnter: change,
      onEnterBack: change,
    });
    // change();
  });

  detectOpen();
};

const initialNavColorChange = (color, section) => {
  let endColor = brandColor;

  const logo = document.querySelector('.nav_logo');
  const bg = gsap.getProperty(section, 'backgroundColor');

  if (colorsEqual(bg, brandColor)) {
    endColor = color;
    console.log('brand');
  }

  if (!didLogoColorChange) {
    console.log(endColor);
    gsap.fromTo(
      logo,
      {
        color: color,
      },
      {
        color: endColor,
        duration: 1,
        ease: 'power3.inOut',
      }
    );
    didLogoColorChange = true;
  } else {
    console.log(endColor);
    gsap.to(logo, {
      color: endColor,
      duration: 0.3,
      ease: 'power3.inOut',
    });
  }
};

let timer = null;
const debouncer = (func, ms = 100) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
    clearTimeout(timer);
  }, ms);
};

const detectOpen = () => {
  const menuButton = document.querySelector('.w-nav-button');
  menuButton.addEventListener('click', () => {
    setTimeout(() => {
      if (menuButton.classList.contains('w--open')) {
        document.querySelector('.nav_bar').classList.add('is-open');
      } else document.querySelector('.nav_bar').classList.remove('is-open');
    }, 0);
  });
};
