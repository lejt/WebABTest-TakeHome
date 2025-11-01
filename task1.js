// constants
const FLEX_CONTAINER = '.contact-form__inner';
const FORM_PARENT = '.contact-form__form';
const FORM_SELECTOR = '.hbspt-form';
const FORM_STEP_1_FIELDS = '.form-columns-2, .hs_email';
const FORM_STEP_2_FIELDS =
  '.hs_how_can_we_help_you___contact_us_form_, .legal-consent-container, .hs_submit';
const FORM_OMITTED =
  '.hs_conversion__how_did_you_hear_about_us_, .hs_recaptcha';
const FORM_ERROR_MESSAGES = '.hs-error-msgs';
const INJECTED_HEADER_TEXT = 'Hello Conversion!';
const INJECTED_PARAGRAPH_TEXT = 'Click on the button below to contact us.';
const INJECTED_BUTTON_TEXT = 'Click Here';
const MODAL_CLOSE = 'X';
const MODAL_NEXT = 'Next ->';
const MODAL_BACK = '<- Back';
const MODAL_SUCCESS = 'You have submitted your information successfully.';

const style = document.createElement('style');
style.textContent = `
    ${FLEX_CONTAINER} {
      align-items: flex-start;
    }
    [data-ab-element-id="injected-overlay"] {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 99999;
    }
    [data-ab-element-id="form-container"] {
      background: #fff;
      z-index: 100000; 
    }

    [data-ab-element-id="injected-paragraph"] {
      color: darkgray;
    }
    [data-ab-element-id="injected-button-wrapper"] {
      display: flex;
      justify-content: flex-end;
    }
    [data-ab-element-id="open-modal-btn"] {
      background: #5E5D5D;
      color: white;
      border: 2px solid #5E5D5D;
      padding: 10px 20px;
      cursor: pointer;
    }
    [data-ab-element-id="open-modal-btn"]:hover {
      background: #333;
      border: 2px solid gray;
    }

    [data-ab-element-id="form-modal"] {
      border: none;
      border-radius: 6px;
      padding: 1.5rem;
      width: 500px;
      max-width: 90%;
    }

    [data-ab-element-id="form-modal"] button {
      margin: 2px;
    }

    [data-ab-element-id="modal-header"], [data-ab-element-id="modal-footer"] {
      display: flex;
      justify-content: flex-end;
    }

    [data-ab-element-id="modal-next"], [data-ab-element-id="modal-back"] {
      border: 2px solid black;
      cursor: pointer;
    }

    [data-ab-element-id="modal-next"]:disabled, [data-ab-element-id="modal-back"]:disabled {
      background: gray;
      color: #fff;
      opacity: 0.6;
      cursor: not-allowed;
      border-color: #999;
    }

    [data-ab-element-id="modal-next"]:not(:disabled):hover,
    [data-ab-element-id="modal-back"]:not(:disabled):hover {
      background: #444;
      color: white;
    }

    [data-ab-element-id="modal-step"] {
      display: none;
    }
    [data-ab-element-id="modal-step"].active {
      display: block;
    }

    .modal-progress {
      text-align: center;
      margin-bottom: 1rem;
      font-weight: bold;
    }

  `;

// Wait for async HubSpot form to render
const waitForHubspotForm = setInterval(() => {
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  clearInterval(waitForHubspotForm);
  initABExperiment(form);
}, 300);

const createLandingContent = () => {
  const injectedWrapper = document.createElement('div');
  const injectedHeader = document.createElement('h3');
  const injectedParagraph = document.createElement('p');
  const injectedButtonWrapper = document.createElement('div');
  const injectedButton = document.createElement('button');

  injectedParagraph.setAttribute('data-ab-element-id', 'injected-paragraph');
  injectedButtonWrapper.setAttribute(
    'data-ab-element-id',
    'injected-button-wrapper'
  );
  injectedButton.setAttribute('data-ab-element-id', 'open-modal-btn');
  injectedHeader.textContent = INJECTED_HEADER_TEXT;
  injectedParagraph.textContent = INJECTED_PARAGRAPH_TEXT;
  injectedButton.textContent = INJECTED_BUTTON_TEXT;

  injectedButtonWrapper.appendChild(injectedButton);
  injectedWrapper.append(
    injectedHeader,
    injectedParagraph,
    injectedButtonWrapper
  );

  return { injectedWrapper, injectedButton };
};

const createModal = () => {
  const modal = document.createElement('dialog');
  const modalHeader = document.createElement('div');
  const modalBody = document.createElement('div');
  const modalFooter = document.createElement('div');
  const modalClose = document.createElement('button');

  modal.setAttribute('data-ab-element-id', 'form-modal');
  modalHeader.setAttribute('data-ab-element-id', 'modal-header');
  modalBody.setAttribute('data-ab-element-id', 'modal-body');
  modalFooter.setAttribute('data-ab-element-id', 'modal-footer');

  modalClose.textContent = MODAL_CLOSE;

  modalHeader.appendChild(modalClose);
  modal.append(modalHeader, modalBody, modalFooter);

  modalClose.addEventListener('click', () => modal.close());

  return { modal, modalHeader, modalBody, modalFooter };
};

const initABExperiment = (form) => {
  // hide original form
  form.style.display = 'none';

  // Hubspot form elements
  const hubSpotForm = form;
  hubSpotForm.style.display = 'block'; // must display for Hubspot children to be rendered
  const modalStep1Fields = hubSpotForm.querySelectorAll(FORM_STEP_1_FIELDS);
  const modalStep2Fields = hubSpotForm.querySelectorAll(FORM_STEP_2_FIELDS);
  const modalOmittedFields = hubSpotForm.querySelectorAll(FORM_OMITTED);
  const modalErrorMessages = hubSpotForm.querySelectorAll(FORM_ERROR_MESSAGES);

  const { injectedWrapper, injectedButton } = createLandingContent();
  const { modal, modalBody, modalFooter } = createModal();

  const modalProgress = document.createElement('div');
  const modalNext = document.createElement('button');
  const modalBack = document.createElement('button');
  const modalStep1 = document.createElement('div');
  const modalStep2 = document.createElement('div');
  const modalStep3 = document.createElement('div');
  modalProgress.setAttribute('data-ab-element-id', 'modal-progress');
  modalBack.setAttribute('data-ab-element-id', 'modal-back');
  modalNext.setAttribute('data-ab-element-id', 'modal-next');
  modalStep1.setAttribute('data-ab-element-id', 'modal-step');
  modalStep2.setAttribute('data-ab-element-id', 'modal-step');
  modalStep1.classList.add('active');

  modalNext.textContent = MODAL_NEXT;
  modalBack.textContent = MODAL_BACK;
  modalStep3.textContent = MODAL_SUCCESS;

  const formContainer = document.querySelector(FORM_PARENT);
  formContainer.setAttribute('data-ab-element-id', 'form-container');
  const overlay = document.createElement('div');
  overlay.setAttribute('data-ab-element-id', 'injected-overlay');

  // event listeners
  let modalCurrentStep = 1;
  const modalSteps = [modalStep1Fields, modalStep2Fields];

  injectedButton.addEventListener('click', () => modal.showModal());

  document.addEventListener('click', (e) => {
    const clickedInsideInjectedWrapper = formContainer.contains(e.target);
    if (!clickedInsideInjectedWrapper) {
      overlay.remove();
    }
  });
  overlay.addEventListener('click', (e) => {
    if (!injectedWrapper.contains(e.target)) {
      overlay.remove();
    }
  });

  modalNext.addEventListener('click', () => handleStepChange(1));
  modalBack.addEventListener('click', () => handleStepChange(-1));

  const handleStepChange = (increment) => {
    const currentFields = modalSteps[modalCurrentStep - 1];

    // check for error messages
    const hasVisibleErrors = Array.from(
      document.querySelectorAll(FORM_ERROR_MESSAGES)
    ).some((err) => err.offsetParent !== null);

    // check if inputs filled
    const allFilled = Array.from(currentFields)
      .flatMap((field) =>
        Array.from(field.querySelectorAll('input, textarea, select'))
      )
      .filter((el) => el.offsetParent !== null)
      .every((input) => input.value.trim() !== '');

    if (hasVisibleErrors || !allFilled) {
      console.warn('Please fill all required fields before continuing.');
      return;
    }

    const newStep = modalCurrentStep + increment;
    if (newStep >= 1 && newStep <= modalSteps.length) {
      modalCurrentStep = newStep;
      showSteps();
    }
  };

  const showSteps = () => {
    modalNext.disabled = modalCurrentStep === modalSteps.length;
    modalBack.disabled = modalCurrentStep === 1;
    modalProgress.textContent = `Step ${modalCurrentStep} of ${modalSteps.length}`;

    [...modalStep1Fields, ...modalStep2Fields, ...modalOmittedFields].forEach(
      (field) => {
        field.style.display = 'none';
      }
    );

    const currentStepFields = modalSteps[modalCurrentStep - 1];
    currentStepFields.forEach((field) => {
      field.style.display = 'block';
    });
  };
  showSteps();

  // display on page
  document.head.appendChild(style);
  formContainer.append(injectedWrapper, modal);
  document.body.appendChild(overlay);

  modalBody.append(modalProgress, modalStep1, modalStep2);
  modalStep1.appendChild(hubSpotForm);
  modalFooter.append(modalBack, modalNext);
};

// NEXT STEPS
// 2) progress bar
// 3) success message
// 4) deal with flicker
