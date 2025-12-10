import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { img2svg } from './img2svg';

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

export const introAnim = async () => {
  const introSection = document.querySelector('.section_intro');
  if (!introSection) return;
  const introPeakWrap = document.querySelector('.intro_peak-wrap');
  let introPeak = introPeakWrap.querySelector('.intro_peak');
  introPeak = await img2svg(introPeak);
  const peakCircles = introPeak?.querySelectorAll('path') ?? null;
  const scanner = introSection.querySelector('.intro_scanner');
  const mainWrapper = document.querySelector('.main-wrapper');

  gsap.set(introSection, {
    position: 'relative',
    zIndex: 1,
  });
  gsap.set(mainWrapper, {
    position: 'relative',
    zIndex: 2,
  });
  gsap.set(introPeakWrap, {
    overflow: 'clip',
  });
  // gsap.set(scanner, {
  //   top: 0,
  //   y: '-100%',
  // });

  const scanDuration = 5;
  const peakRect = introPeak.getBoundingClientRect();
  const peakHeight = peakRect.height;
  const peakTop = peakRect.top;
  const startPeak = (peakHeight / window.innerHeight) * scanDuration;
  const peakDuration = (peakTop / window.innerHeight) * scanDuration;
  console.log(peakHeight, peakTop, startPeak, peakDuration);

  const tl = gsap.timeline();

  tl.fromTo(
    scanner,
    {
      y: -window.innerHeight / 2,
      duration: scanDuration,
      ease: 'power1',
    },
    {
      y: window.innerHeight / 2,
      duration: scanDuration,
      ease: 'power1',
    }
  );

  if (peakCircles) {
    tl.from(
      peakCircles,
      {
        opacity: 0,
        scale: 0,
        duration: peakDuration,
        ease: 'power1',
      },
      startPeak
    );

    tl.from(
      introPeakWrap,
      {
        height: 0,
        duration: peakDuration,
        ease: 'power1',
      },
      startPeak
    );
  }

  console.log(scanDuration - startPeak);

  tl.to(
    scanner,
    {
      y: -window.innerHeight / 2,
      duration: 2,
      ease: 'power1',
    },
    'simultaneous'
  );
  tl.to(
    mainWrapper,
    {
      marginTop: -window.innerHeight,
      duration: 2,
      ease: 'power1',
    },
    'simultaneous'
  );

  // tl.call(
  //   () => {
  //     console.log('Triggered 2s before end!');
  //     ScrollTrigger.refresh();
  //   },
  //   null,
  //   tl.duration() - 2
  // );

  tl.eventCallback('onComplete', () => {
    gsap.to(introSection, {
      pointerEvents: 'none',
      visibility: 'hidden',
    });

    ScrollTrigger.refresh();
  });
};
