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

  // DOM changes applied here and function is called everytime there is change of
  // elements in SPA (route change)
  const applyDomChanges = () => {
    const heroContainer = document.querySelector(HERO_CONTAINER);
    const header = document.querySelector(`${HERO_CONTAINER} ${HERO_HEADER}`);
    const buttonContainer = document.querySelector(HERO_BUTTONS);
    const allButtons = buttonContainer.querySelectorAll('button');
    const infoSection = document.querySelector(HERO_WHY_SECTION);

    heroContainer.setAttribute(AB_ELEMENT_ID, 'header-container');

    // check if valuePropWrapper is added to current DOM
    const alreadyApplied = document.querySelector(
      `[${AB_ELEMENT_ID}="value-prop-list"]`
    );
    if (alreadyApplied) {
      return;
    }

    if (!header || !buttonContainer || !heroContainer) {
      return;
    }

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
      videoButtonClone.removeChild(nestedSpan);
      originalVideoButton.replaceWith(videoButtonClone);

      demoButton.textContent = CONTACT_US;

      if (infoSection) {
        videoButtonClone.addEventListener('click', (event) => {
          infoSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  };

  // watch document body for SPA changes and call applyDomChanges function
  const initMutationObserver = () => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          if (document.querySelector(HERO_CONTAINER)) {
            observer.disconnect();

            applyDomChanges();

            observer.observe(targetNode, config);
            return;
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };

  applyDomChanges();
  initMutationObserver();
})();
