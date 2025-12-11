import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { img2svg } from './img2svg';

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

export const introAnim = async () => {
  const introSection = document.querySelector('.section_intro');
  if (!introSection) return;

  const peakWrap = document.querySelector('.intro_peak-wrap');
  let peak = peakWrap.querySelector('.intro_peak');
  peak = await img2svg(peak);
  const peakCircles = peak?.querySelectorAll('path') ?? null;

  const scanner = introSection.querySelector('.intro_scanner');
  const mainWrapper = document.querySelector('.main-wrapper');

  const title1 = introSection.querySelector('.intro_title-block.is-1');
  const title2 = introSection.querySelector('.intro_title-block.is-2');

  gsap.set(introSection, {
    position: 'relative',
    zIndex: 1,
  });
  gsap.set(mainWrapper, {
    position: 'relative',
    zIndex: 2,
  });
  gsap.set(peakWrap, {
    overflow: 'clip',
  });
  gsap.set(scanner, {
    top: 0,
    y: 0,
  });

  const scanDuration = 5;
  const peakRect = peak.getBoundingClientRect();
  const peakHeight = peakRect.height;
  const peakTop = peakRect.top;
  const peakStart = (peakHeight / window.innerHeight) * scanDuration;
  const peakDuration = (peakTop / window.innerHeight) * scanDuration;

  const tl = gsap.timeline();

  tl.to(scanner, {
    y: peakTop,
    duration: peakStart,
    ease: 'none',
  });

  if (peakCircles) {
    tl.from(
      peakCircles,
      {
        opacity: 0,
        scale: 0,
        duration: peakDuration,
        ease: 'none',
      },
      'draw-peak'
    );
  }

  tl.from(
    peakWrap,
    {
      height: 0,
      duration: peakDuration,
      ease: 'none',
    },
    'draw-peak'
  )
    .to(
      scanner,
      {
        y: peakTop + peakHeight,
        duration: peakDuration,
        ease: 'none',
      },
      'draw-peak'
    )
    .to(scanner, {
      y: window.innerHeight,
      duration: scanDuration - peakStart - peakDuration,
      ease: 'none',
    });

  let didTitleChange = false;

  tl.eventCallback('onUpdate', () => {
    if (didTitleChange) return;
    const y = gsap.getProperty(scanner, 'y');
    if (y >= window.innerHeight / 2) {
      didTitleChange = true;
      gsap.to(title1, {
        opacity: 0,
      });
      gsap.fromTo(
        title2,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      );
    }
  });

  tl.to(
    scanner,
    {
      y: 0,
      duration: 2,
      ease: 'power1.out',
    },
    'reveal-hero'
  ).to(
    mainWrapper,
    {
      marginTop: -window.innerHeight,
      duration: 2,
      ease: 'power1.out',
    },
    'reveal-hero'
  );

  tl.eventCallback('onComplete', () => {
    gsap.to(introSection, {
      pointerEvents: 'none',
      visibility: 'hidden',
    });

    window.scrollTo(0, 1);

    ScrollTrigger.refresh();
  });
};
