// hard to target hubspot elements, it needs to render first, it also is rendered async, cloning /removing those elements will strip associations
// can only reference or manipulate them in place

// Element identifiers
const FORM_FLEX_PARENT = '.contact-form__inner';
const FORM_SELECTOR = '.contact-form__form';
const FORM_FIRST_LAST_NAME = '.form-columns-2';
const FORM_FIRST_NAME = '.hs_firstname';
const FORM_LAST_NAME = '.hs_lastname';
const FORM_EMAIL = '.hs_email';
const FORM_HELP_INPUT = '.hs_how_can_we_help_you___contact_us_form_';
const FORM_CONSENT = '.legal-consent-container';
const FORM_SUBMIT = '.hs_submit';
const INJECTED_HEADER_TEXT = 'Hello Conversion!';
const INJECTED_PARAGRAPH_TEXT = 'Click on the button below to contact us.';
const INJECTED_BUTTON_TEXT = 'Click Here';

// Elements
const formFlexParent = document.querySelector(FORM_FLEX_PARENT);
const originalFormElement = document.querySelector(FORM_SELECTOR);
const originalFormContent = originalFormElement.querySelector('form');

const originalFormFirstLastNames = document.querySelector(FORM_FIRST_LAST_NAME);

const originalFormFirstName = document.querySelector(FORM_FIRST_NAME);
const originalFormLastName = document.querySelector(FORM_LAST_NAME);
const originalFormEmail = document.querySelector(FORM_EMAIL);
const originalFormHelpInput = document.querySelector(FORM_HELP_INPUT);
const originalFormConsent = document.querySelector(FORM_CONSENT);
const originalFormSubmitButton = document.querySelector(FORM_SUBMIT);

const overlay = document.createElement('div');
const injectedContent = document.createElement('div');
const injectedHeader = document.createElement('h3');
const injectedParagraph = document.createElement('p');
const injectedButtonParent = document.createElement('div');
const injectedButton = document.createElement('button');

const injectedModal = document.createElement('dialog');
const modalHeader = document.createElement('div');
const modalBody = document.createElement('div');
const modalFooter = document.createElement('div');
const modalStep1 = document.createElement('div');
const modalStep2 = document.createElement('div');
const modalStep3 = document.createElement('div');
const modalProgressBar = document.createElement('div');
const modalThankYouMessage = document.createElement('h4');
const modalNextButton = document.createElement('button');
const modalBackButton = document.createElement('button');
const modalCloseButton = document.createElement('button');

const style = document.createElement('style');

overlay.setAttribute('data-ab-element-id', 'injected-overlay');
injectedContent.setAttribute('data-ab-element-id', 'injected-content');
injectedButtonParent.setAttribute('data-ab-element-id', 'button-wrapper');
injectedButton.setAttribute('data-ab-element-id', 'open-modal-btn');
injectedParagraph.setAttribute('data-ab-element-id', 'injected-paragraph');
injectedModal.setAttribute('data-ab-element-id', 'injected-modal');
modalHeader.setAttribute('data-ab-element-id', 'modal-header');
modalBody.setAttribute('data-ab-element-id', 'modal-body');
modalFooter.setAttribute('data-ab-element-id', 'modal-footer');
modalStep1.setAttribute('data-ab-step', '1');
modalStep2.setAttribute('data-ab-step', '2');
modalStep3.setAttribute('data-ab-step', '3');
modalProgressBar.setAttribute('data-ab-element-id', 'modal-progress-bar');
modalNextButton.setAttribute('data-ab-element-id', 'modal-next-button');
modalBackButton.setAttribute('data-ab-element-id', 'modal-back-button');
modalCloseButton.setAttribute('data-ab-element-id', 'modal-close-button');

const bgColor = window.getComputedStyle(originalFormElement).backgroundColor;
const buttonBgColor = window.getComputedStyle(
  originalFormSubmitButton
).backgroundColor;

injectedHeader.textContent = INJECTED_HEADER_TEXT;
injectedParagraph.textContent = INJECTED_PARAGRAPH_TEXT;
injectedButton.textContent = INJECTED_BUTTON_TEXT;
modalCloseButton.textContent = 'x';
modalBackButton.textContent = '<-';
modalNextButton.textContent = '->';

style.textContent = `
  ${FORM_FLEX_PARENT} {
    align-items: flex-start;
  }

  [data-ab-element-id="injected-overlay"] {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
  }

  ${FORM_SELECTOR} {
    position: relative;
    background: ${bgColor};
    color: #000;
    z-index: 100000;
  }

  [data-ab-element-id="injected-content"] {
    display: flex;
    flex-direction: column; 
  }

  [data-ab-element-id="button-wrapper"] {
    display: flex;
    justify-content: flex-end;
  }

  [data-ab-element-id="open-modal-btn"] {
    height: 40px;
    width: 100px;
    background: #5E5D5D;
    cursor: pointer;

    :hover {
    }
  }
    
  [data-ab-element-id="button-wrapper"] {
    display: flex;
    justify-content: flex-end;
  }
    
  [data-ab-element-id="injected-paragraph"] {
    color: dark slate gray;
  }

  [data-ab-element-id="modal-body"] {
    display: flex;
    flex-direction: column;
  }

  [data-ab-element-id="modal-header"], [data-ab-element-id="modal-footer"] {
    display: flex;
    justify-content: flex-end;
  }

  [data-ab-element-id="modal-close-button"] {
    cursor: pointer;
  }

  [data-ab-element-id="modal-close-button"]:hover {
    color: gray;
  }

  [data-ab-element-id="modal-next-button"], [data-ab-element-id="modal-back-button"] {
    width: 40px;
    height: 20px;
    border: 2px solid black;
    cursor: pointer;
  }

  [data-ab-element-id="modal-next-button"]:disabled, [data-ab-element-id="modal-back-button"]:disabled {
    background: gray;
    color: #fff;
    opacity: 0.6;
    cursor: not-allowed;
    border-color: #999;
  }

  [data-ab-element-id="modal-next-button"]:not(:disabled):hover,
  [data-ab-element-id="modal-back-button"]:not(:disabled):hover {
    background: #444;
    color: white;
  }
`;

// initial modal state
let modalCurrentStep = 1;
const modalStates = { 1: modalStep1, 2: modalStep2, 3: modalStep3 };

document.addEventListener('click', (e) => {
  const clickedInside = originalFormElement.contains(e.target);
  if (!clickedInside) {
    overlay.remove();
  }
});
overlay.addEventListener('click', (e) => {
  if (!originalFormElement.contains(e.target)) {
    overlay.remove();
  }
});
originalFormElement.addEventListener('click', (e) => e.stopPropagation());
injectedButton.addEventListener('click', function () {
  injectedModal.showModal();
});

// modal actions
modalCloseButton.addEventListener('click', () => injectedModal.close());
modalNextButton.addEventListener('click', () => {
  // validate form is filled correctly first
  modalCurrentStep++;
  updateStepDisplay();
});
modalBackButton.addEventListener('click', () => {
  modalCurrentStep--;
  updateStepDisplay();
});

const updateStepDisplay = () => {
  const currentStepAsStr = String(modalCurrentStep);
  Object.keys(modalStates).forEach((key) => {
    modalStates[key].hidden = key !== currentStepAsStr;
  });
  modalNextButton.disabled = modalCurrentStep === 3;
  modalBackButton.disabled = modalCurrentStep === 1;
};

// Hide original content
originalFormContent.hidden = true;
modalStep2.hidden = true;
modalStep3.hidden = true;
updateStepDisplay();

// Inject elements
document.body.appendChild(overlay);
document.head.appendChild(style);
injectedButtonParent.appendChild(injectedButton);
injectedContent.append(
  injectedHeader,
  injectedParagraph,
  injectedButtonParent,
  injectedModal
);
originalFormElement.appendChild(injectedContent);

// Modal
modalStep1.append(
  // originalFormFirstName,
  // originalFormLastName,
  originalFormFirstLastNames,
  originalFormEmail
);
modalStep2.append(
  originalFormHelpInput,
  originalFormConsent,
  originalFormSubmitButton
);
modalStep3.append(modalThankYouMessage);
modalHeader.appendChild(modalCloseButton); // ADD failure message?
modalBody.append(modalProgressBar, modalStep1, modalStep2, modalStep3);
modalFooter.append(modalBackButton, modalNextButton);
injectedModal.append(modalHeader, modalBody, modalFooter);
