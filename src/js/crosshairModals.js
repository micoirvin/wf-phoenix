import gsap from 'gsap';
export const crosshairModals = () => {
  const modals = document.querySelectorAll('[modal][anim-crosshair]');
  modals.forEach((m) => {
    gsap.set(m, {
      transition: 'unset',
      opacity: 0,
      visibility: 'hidden',
    }); // removes default modal styling
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const { attributeName, oldValue, target } = mutation;

        if (target.hasAttribute(attributeName) && oldValue === null) {
          console.log(
            `Attribute "${attributeName}" was ADDED with value: ${target.getAttribute(attributeName)}`
          );
          animateCrosshair(target);
        } else if (!target.hasAttribute(attributeName) && oldValue !== null) {
          console.log(`Attribute "${attributeName}" was REMOVED (previous value: ${oldValue})`);
          animateCrosshair(target, false);
        } else {
          // console.log(`Attribute "${attributeName}" was CHANGED from "${oldValue}" to "${target.getAttribute(attributeName)}"`);
        }
      }
    });
  });

  modals.forEach((m) => {
    observer.observe(m, {
      attributes: true,
      attributeOldValue: true,
    });
  });

  const animateCrosshair = (outer, show = true) => {
    const inner = outer.querySelector('[modal-content]');
    if (!inner) return;

    const button = outer.querySelector('[modal-close]');

    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill();
        console.log('Timeline killed after completion');
      },
    });
    tl.set(inner, {
      overflow: 'clip',
    });

    const showProps = {
      opacity: 1,
      ease: 'power4.in',
      duration: 0.4,
    };

    const hideProps = {
      opacity: 0,
      ease: 'power4.in',
      duration: 0.4,
    };

    const ungrowProps = {
      width: 0,
      height: 0,
      duration: 1,
      ease: 'power4.out',
    };

    if (show) {
      tl.set(outer, {
        visibility: 'visible',
        pointerEvents: 'none',
      })
        .to(outer, showProps)
        .from(inner, { ...ungrowProps, delay: 0.5, clearProps: 'width,height' })
        .set(outer, {
          pointerEvents: 'auto',
        });

      if (button) tl.fromTo(button, { opacity: 0 }, { opacity: 1 }, '-=0.5');
    } else {
      if (button) tl.fromTo(button, { opacity: 1 }, { opacity: 0 });
      tl.to(inner, ungrowProps, '-=0.5')
        .to(outer, { ...hideProps })
        .set(inner, { clearProps: 'width,height' })
        .set(outer, {
          visibility: 'hidden',
          pointerEvents: 'none',
        });
    }
  };
};
