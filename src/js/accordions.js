export const accordions = () => {
  const accordionRoots = document.querySelectorAll('[accordion-element="root"]');

  accordionRoots.forEach((accordion) => {
    const mq = accordion.getAttribute('accordion-mq') || null;
    const mqs = {
      'mob-l': '(max-width: 767px)',
    };
    let isInitialized = false;
    let isEnabled = false;

    const accordionItems = accordion.querySelectorAll('[accordion-element="item"]');

    function onMatch() {
      isEnabled = true;
      if (!isInitialized) {
        isInitialized = true;
        accordionItems.forEach((item, index) => {
          const header = item.querySelector('[accordion-element="header"]');
          const contentWrapper = item.querySelector('[accordion-element="content-wrap"]');
          contentWrapper.style.maxHeight = '0px';

          // accessibility
          let accordionId = `accordion-${index}`;
          let accordionTargetId = `accordion-target-${index}`;
          header.id = accordionId;
          header.setAttribute('aria-controls', accordionTargetId);
          contentWrapper.id = accordionTargetId;
          contentWrapper.setAttribute('labelledby', accordionId);

          header.addEventListener('click', (e) => {
            if (!isEnabled) return;
            e.preventDefault();
            accordionItems.forEach((otherItem) => {
              const toState = otherItem === item ? 'toggle' : 'close';
              toggleAccordionItem(otherItem, toState);
            });
          });

          if (accordion.getAttribute('accordion-open-first') === 'true') {
            toggleAccordionItem(accordionItems[0], 'open');
          }
        });
      }
    }

    function onUnmatch() {
      isEnabled = false;
      accordionItems.forEach((item) => {
        toggleAccordionItem(item, 'openunset');
      });
    }

    if (mq) {
      const mediaQuery = window.matchMedia(mqs[mq]);
      function handleMediaChange(e) {
        if (e.matches) {
          onMatch();
        } else {
          onUnmatch();
        }
      }
      handleMediaChange(mediaQuery);
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      onMatch();
    }
  });
};

const toggleAccordionItem = (item, toState = 'toggle') => {
  let isExpanded = item.getAttribute('accordion-expanded');
  isExpanded = isExpanded === 'true' ? false : true;
  if (toState === 'toggle') {
    // as is
  } else if (toState === 'close') {
    isExpanded = false;
  } else if (toState === 'open') {
    isExpanded = true;
  } else if (toState === 'openunset') {
    isExpanded = true;
  } else return;

  const header = item.querySelector('[accordion-element="header"]');
  const contentWrapper = item.querySelector('[accordion-element="content-wrap"]');
  const height = contentWrapper
    .querySelector('[accordion-element="content"]')
    .getBoundingClientRect().height;

  header.setAttribute('aria-expanded', String(isExpanded));
  item.setAttribute('accordion-expanded', String(isExpanded));

  contentWrapper.style.maxHeight = isExpanded ? `${height}px` : '0px';
  if (toState === 'openunset') {
    contentWrapper.style.maxHeight = 'unset';
  }
};
