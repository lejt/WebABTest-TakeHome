(() => {
  const AB_ELEMENT_ID = 'data-ab-element-id';
  const HERO_CONTAINER = '.lm-hero';
  const HERO_HEADER = '.lm-hero__header';
  const HERO_BUTTONS = '.lm-hero__buttons';
  const HERO_WHY_SECTION = '.lm-why';
  const HEADER_TEXT = 'We are the best experimentation agency in the world';
  const CONTACT_US = 'Contact us';
  const VALUE_PROP_1 = 'Increase conversion rates across your website';
  const VALUE_PROP_2 = 'Iterative site redesign';
  const VALUE_PROP_3 = 'Improve ROAS efficiency';
  const VALUE_PROP_4 = 'Standing or scaling an experimentation program';
  const VALUE_PROP_5 = 'Advanced customer research';

  let observer = null;

  const createBulletPoint = (str) => {
    const pointWrapper = document.createElement('div');
    const checkWrapper = document.createElement('div');
    const text = document.createElement('span');

    pointWrapper.setAttribute(AB_ELEMENT_ID, 'bullet-point');

    checkWrapper.innerHTML = `&#10003;`;
    text.textContent = str;

    pointWrapper.append(checkWrapper, text);
    return pointWrapper;
  };

  /* 
    DOM changes applied here and function is called everytime there is change of elements in SPA (route change)
  */
  const applyDomChanges = (heroContainer) => {
    // check if valuePropWrapper is added to current DOM
    const alreadyApplied = heroContainer.querySelector(
      `[${AB_ELEMENT_ID}="value-prop-list"]`
    );
    if (alreadyApplied) {
      return;
    }

    // if (!header || !buttonContainer || !heroContainer) {
    //   return;
    // }

    // const heroContainer = document.querySelector(HERO_CONTAINER);

    // if (!heroContainer) {
    //   return;
    // }

    const header = heroContainer.querySelector(
      `${HERO_CONTAINER} ${HERO_HEADER}`
    );
    const buttonContainer = heroContainer.querySelector(HERO_BUTTONS);
    const allButtons = buttonContainer.querySelectorAll('button');
    const infoSection = document.querySelector(HERO_WHY_SECTION);

    if (!header || !buttonContainer) {
      return;
    }

    heroContainer.setAttribute(AB_ELEMENT_ID, 'header-container');

    const valuePropWrapper = document.createElement('div');
    valuePropWrapper.setAttribute(AB_ELEMENT_ID, 'value-prop-list');

    const valueList = [
      VALUE_PROP_1,
      VALUE_PROP_2,
      VALUE_PROP_3,
      VALUE_PROP_4,
      VALUE_PROP_5,
    ];

    valueList.forEach((text) => {
      valuePropWrapper.appendChild(createBulletPoint(text));
    });

    header.textContent = HEADER_TEXT;
    header.after(valuePropWrapper);

    if (allButtons.length >= 2) {
      const demoButton = allButtons[0];
      const originalVideoButton = allButtons[1];

      const videoButtonClone = originalVideoButton.cloneNode(true);
      const nestedSpan = videoButtonClone.querySelector('span');
      if (nestedSpan) {
        videoButtonClone.removeChild(nestedSpan);
      }
      originalVideoButton.replaceWith(videoButtonClone);

      demoButton.textContent = CONTACT_US;

      if (infoSection) {
        videoButtonClone.addEventListener('click', (e) => {
          e.preventDefault();
          infoSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  };

  // watch document body for SPA changes and call applyDomChanges function
  const initMutationObserver = () => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = (mutationsList, currentObserver) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const heroContainer = document.querySelector(HERO_CONTAINER);
          if (heroContainer) {
            // disconnect observer after targetted element appear so it does not continue running
            currentObserver.disconnect();

            applyDomChanges();

            currentObserver.observe(targetNode, config);
            return;
          }
        }
      }
    };

    observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };

  const initialHeroContainer = document.querySelector(HERO_CONTAINER);
  if (initialHeroContainer) {
    applyDomChanges(initialHeroContainer);
  } else {
    // if hero container not present, watch for its arrival
    initMutationObserver();
  }
})();
