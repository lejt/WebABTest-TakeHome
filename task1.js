// change the target for submit to css change to blue since it is affecting other tasks

(() => {
  // constants
  // const FLEX_CONTAINER = '.contact-form__inner';
  const FORM_PARENT = '.contact-form__form';
  const FORM_SELECTOR = '.hbspt-form';
  const FORM_STEP_1_FIELDS = '.form-columns-2, .hs_email';
  const FORM_STEP_2_FIELDS =
    '.hs_how_can_we_help_you___contact_us_form_, .legal-consent-container, .hs_submit';
  const FORM_OMITTED =
    '.hs_conversion__how_did_you_hear_about_us_, .hs_recaptcha';
  const FORM_REQUIRED = '.hs-required';
  const FORM_STEP_1_TITLE = 'Contact Info';
  const FORM_STEP_2_TITLE = 'Your Request';
  const FORM_STEP_3_TITLE = 'Confirmation';
  const INJECTED_HEADER_TEXT = 'Hello Conversion!';
  const INJECTED_PARAGRAPH_TEXT = 'Click on the button below to contact us.';
  const INJECTED_BUTTON_TEXT = 'Click Here';
  const MODAL_CLOSE = '✖';
  const MODAL_NEXT = 'Next →';
  const MODAL_BACK = '← Back';
  const MODAL_SUCCESS = 'You have submitted your information successfully.';

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
    modalClose.setAttribute('data-ab-element-id', 'modal-close');
    modalHeader.setAttribute('data-ab-element-id', 'modal-header');
    modalBody.setAttribute('data-ab-element-id', 'modal-body');
    modalFooter.setAttribute('data-ab-element-id', 'modal-footer');

    modalClose.textContent = MODAL_CLOSE;

    modalHeader.appendChild(modalClose);
    modal.append(modalHeader, modalBody, modalFooter);

    modalClose.addEventListener('click', () => modal.close());

    return { modal, modalHeader, modalBody, modalFooter, modalClose };
  };

  const initABExperiment = (form) => {
    // hide original form
    form.style.display = 'none';

    // Hubspot form elements
    const hubSpotForm = form;
    hubSpotForm.style.display = 'block'; // must display for Hubspot children to be rendered
    const formContainer = document.querySelector(FORM_PARENT);
    const modalStep1Fields = hubSpotForm.querySelectorAll(FORM_STEP_1_FIELDS);
    const modalStep2Fields = hubSpotForm.querySelectorAll(FORM_STEP_2_FIELDS);
    const modalOmittedFields = hubSpotForm.querySelectorAll(FORM_OMITTED);
    // const modalErrorMessages = hubSpotForm.querySelectorAll(FORM_ERROR_MESSAGES);

    const { injectedWrapper, injectedButton } = createLandingContent();
    const { modal, modalBody, modalFooter } = createModal();

    const overlay = document.createElement('div');
    const progressWrapper = document.createElement('div');
    const modalNext = document.createElement('button');
    const modalBack = document.createElement('button');
    const modalStep1 = document.createElement('div');
    const modalStep2 = document.createElement('div');
    const modalStep3 = document.createElement('div');
    const modalStep3Message = document.createElement('p');
    formContainer.setAttribute('data-ab-element-id', 'form-container');
    overlay.setAttribute('data-ab-element-id', 'injected-overlay');
    progressWrapper.setAttribute('data-ab-element-id', 'progress-wrapper');
    modalBack.setAttribute('data-ab-element-id', 'modal-back');
    modalNext.setAttribute('data-ab-element-id', 'modal-next');
    modalStep1.setAttribute('data-ab-element-id', 'modal-step');
    modalStep2.setAttribute('data-ab-element-id', 'modal-step');
    modalStep3.setAttribute('data-ab-element-id', 'modal-step');
    modalStep1.classList.add('active');

    modalNext.textContent = MODAL_NEXT;
    modalBack.textContent = MODAL_BACK;
    modalStep3Message.textContent = MODAL_SUCCESS;
    modalStep3.appendChild(modalStep3Message);

    let modalCurrentStep = 1;
    const stepContainers = [hubSpotForm, hubSpotForm, modalStep3];
    const validationFieldSets = [modalStep1Fields, modalStep2Fields];
    const stepValidationStatus = [false, false, false];

    // event listeners
    injectedButton.addEventListener('click', () => {
      modal.showModal();
    });

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
      if (increment === 1) {
        const currentFields = validationFieldSets[modalCurrentStep - 1];

        if (!validateFields(currentFields)) {
          return;
        }

        // validation passed for step
        if (modalCurrentStep <= stepValidationStatus.length) {
          stepValidationStatus[modalCurrentStep - 1] = true;
        }
      }

      const newStep = modalCurrentStep + increment;

      // allow back button
      if (increment === -1 && newStep >= 1) {
        modalCurrentStep = newStep;
        showSteps();
        return;
      }

      // allow next button
      if (increment === 1 && newStep <= 3) {
        modalCurrentStep = newStep;
        showSteps();
        return;
      }
    };

    const validateFields = (fields) => {
      // identify inputs and filter for required tag
      const requiredInputs = Array.from(fields)
        .flatMap((fieldContainer) => {
          return Array.from(
            fieldContainer.querySelectorAll(
              'input:not([type="hidden"]), textarea, select'
            )
          );
        })
        .filter((input) => {
          const isHubSpotRequired =
            input.closest(FORM_REQUIRED) || input.hasAttribute('required');
          return isHubSpotRequired;
        });

      // validation loop
      for (const input of requiredInputs) {
        let fieldIsValid = true;
        const value = input.value.trim();

        if (value === '') {
          fieldIsValid = false;
        }
        if (input.type === 'email' && value !== '' && !validateEmail(value)) {
          fieldIsValid = false;
        }
        if (input.type === 'checkbox' && !input.checked) {
          fieldIsValid = false;
        }

        if (!fieldIsValid) {
          input.focus();
          return false;
        }
      }

      return true;
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const createProgressBar = () => {
      const stepTitles = [
        FORM_STEP_1_TITLE,
        FORM_STEP_2_TITLE,
        FORM_STEP_3_TITLE,
      ];

      const createStepIndicator = (stepNum, text) => {
        const step = document.createElement('div');
        step.className = 'progress-step';
        step.setAttribute('data-step', stepNum);

        if (stepNum === 1) {
          step.classList.add('active');
        }

        step.innerHTML = `
          <div class="step-icon">
              <span class="icon-number">${stepNum}</span>
              <span class="icon-check">✓</span>
          </div>
          <div class="step-text">${text}</div>
      `;
        return step;
      };

      const progressIndicators = stepTitles.map((title, index) =>
        createStepIndicator(index + 1, title)
      );

      progressIndicators.forEach((indicator) =>
        progressWrapper.appendChild(indicator)
      );
    };

    const showSteps = () => {
      const stepContainers = [modalStep1, modalStep2, modalStep3];

      modalBack.disabled = modalCurrentStep === 1;

      if (modalCurrentStep === 1) {
        modalNext.disabled = false;
      } else if (modalCurrentStep === 2) {
        modalNext.disabled = true;
        modalBack.disabled = false;
      } else if (modalCurrentStep === 3) {
        modalNext.disabled = true;
        modalBack.disabled = true;
      }

      stepContainers.forEach((container, index) => {
        container.classList.remove('active');
        if (index + 1 === modalCurrentStep) {
          container.classList.add('active');
        }
      });

      // hide all elements in modal
      [...modalStep1Fields, ...modalStep2Fields, ...modalOmittedFields].forEach(
        (field) => {
          field.style.display = 'none';
        }
      );

      // show only hubspot forms that are needed
      if (modalCurrentStep === 1 || modalCurrentStep === 2) {
        const currentFields = validationFieldSets[modalCurrentStep - 1];

        currentFields.forEach((field) => {
          field.style.display = 'block';
        });
      }

      const allProgressSteps = document.querySelectorAll('.progress-step');

      allProgressSteps.forEach((step) => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active', 'completed');
        const isStepValidated = stepValidationStatus[stepNum - 1];

        if (stepNum === modalCurrentStep) {
          step.classList.add('active');
        }

        if (isStepValidated) {
          step.classList.add('completed');
        }
      });
    };

    const submitButton = hubSpotForm.querySelector('input[type="submit"]');
    submitButton.setAttribute('data-ab-element-id', 'form-submit');

    if (submitButton) {
      submitButton.value = 'Submit';
      submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        const step2Fields = validationFieldSets[1];

        if (validateFields(step2Fields)) {
          stepValidationStatus[1] = true;

          // Dispatch a native 'submit' event to trigger HubSpot's internal AJAX handler
          hubSpotForm.dispatchEvent(new Event('submit', { bubbles: true }));

          stepValidationStatus[2] = true;
          modalCurrentStep = 3;
          showSteps();
        } else {
          console.warn('Step 2 validation failed on submit.');
        }
      });
    }

    createProgressBar();
    showSteps();

    // display on page
    formContainer.append(injectedWrapper, modal);
    document.body.appendChild(overlay);

    modalBody.append(progressWrapper, hubSpotForm, modalStep3);
    modalFooter.append(modalBack, modalNext);

    formContainer.style.visibility = 'visible';
  };
})();
