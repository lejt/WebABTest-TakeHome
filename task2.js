// (function () {
const AB_ELEMENT_ID = 'data-ab-element-id';
const STICKY_CONTAINER_ATTR_NAME = 'sticky-container';
const STICKY_HEADER_ATTR_NAME = 'sticky-header';
const STICKY_BODY_ATTR_NAME = 'sticky-body';
const SLIDER_WRAPPER_ATTR_NAME = 'slider-wrapper';

const stickyDrawerContainer = document.createElement('div');
const stickyDrawerHeader = document.createElement('div');
const stickyDrawerBody = document.createElement('div');
const chevronIcon = document.createElement('span');
const sliderWrapper = document.createElement('div');

stickyDrawerContainer.setAttribute(AB_ELEMENT_ID, STICKY_CONTAINER_ATTR_NAME);
stickyDrawerHeader.setAttribute(AB_ELEMENT_ID, STICKY_HEADER_ATTR_NAME);
stickyDrawerBody.setAttribute(AB_ELEMENT_ID, STICKY_BODY_ATTR_NAME);
sliderWrapper.setAttribute(AB_ELEMENT_ID, SLIDER_WRAPPER_ATTR_NAME);

chevronIcon.className = 'chevron-icon';
chevronIcon.innerHTML = '&#9650;';

stickyDrawerHeader.innerHTML = `
    <span class="drawer-title">Explore Our Sticky Drawer</span>
  `;

const createCard = () => {
  const card = document.createElement('div');
  const contentWrapper = document.createElement('div');
  const header = document.createElement('div');
  const slideTitle = document.createElement('h6');
  const toolTip = document.createElement('div');
  const imageContainer = document.createElement('div');
  const description = document.createElement('p');
  const button = document.createElement('button');

  card.className = 'info-card';
  contentWrapper.className = 'card-content-wrapper';
  header.className = 'card-header';
  slideTitle.className = 'slide-title';
  toolTip.className = 'slide-tooltip';
  imageContainer.className = 'image-container';
  description.className = 'slide-description';
  button.className = 'slide-button';

  slideTitle.textContent = 'TITLE HERE';
  toolTip.textContent = 'ⓘ';
  imageContainer.textContent = 'IMAGE HERE';
  description.textContent = `description here`;
  button.textContent = 'Click Me';

  header.append(slideTitle, toolTip);
  contentWrapper.append(header, imageContainer, description, button);
  card.appendChild(contentWrapper);

  return card;
};

const count = 7;
for (let i = 0; i < count; i++) {
  const card = createCard();
  sliderWrapper.appendChild(card);
}

const setupInitialPosition = () => {
  const bodyHeight = stickyDrawerBody.offsetHeight;
  stickyDrawerContainer.style.transform = `translateY(${bodyHeight}px)`;
};

if (stickyDrawerContainer && stickyDrawerHeader) {
  stickyDrawerHeader.addEventListener('click', () => {
    stickyDrawerContainer.classList.toggle('is-open');

    const isOpen = stickyDrawerContainer.classList.contains('is-open');
    // UX practice to prevent double scrolling
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

stickyDrawerHeader.appendChild(chevronIcon);
stickyDrawerBody.appendChild(sliderWrapper);
stickyDrawerContainer.append(stickyDrawerBody, stickyDrawerHeader);
document.body.appendChild(stickyDrawerContainer);
setupInitialPosition();
// })();
