import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const slidesAnim = () => {
  const slidesWrap = document.querySelector('.slides_wrap');
  if (!slidesWrap) return;

  const slidesOuter = slidesWrap.closest('.section');
  const slides = slidesWrap.querySelectorAll('.slides_slide');

  gsap.set(slidesOuter, {
    height: window.innerHeight * slides.length,
    position: 'sticky',
    top: 0,
  });

  gsap.set(slidesWrap, {
    position: 'relative',
  });
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: slidesOuter,
      pin: true,
      pinSpacer: false,
      pinSpacing: false,
      scrub: true,
      start: 'top top',
      end: `bottom bottom`,
      // endTrigger: slides[slides.length - 1],
    },
    onComplete: () => {
      ScrollTrigger.refresh();
    },
  });

  const segment = 1 / slides.length;

  slides.forEach((slide, i) => {
    gsap.set(slide, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: window.innerHeight,
      opacity: i === 0 ? 1 : 0,
      zIndex: i,
    });

    const elements = slide.querySelectorAll(':scope > *');
    gsap.set(elements, {
      opacity: 0,
    });
    tl.to(
      [slide, ...elements],
      {
        opacity: 1,
        duration: segment,
        ease: 'power3.out',
      },
      i * segment
    );
  });
};
