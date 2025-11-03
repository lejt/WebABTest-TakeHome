const style = document.createElement('style');
style.textContent = `
  :root {
    /* Primary Button Color (Used for progress bar, Next/Back/Submit buttons) */
    --color-primary: #007bff; 
    --color-primary-dark: dodgerblue;
    --color-primary-darker: mediumblue;

    /* Secondary Button Color (Used for open-modal-btn) */
    --color-secondary: black;
    --color-secondary-dark: gray;
    --color-secondary-darker: darkslategray;

    /* Tertiary Button Color */
    --color-tertiary: khaki;
    --color-tertiary-dark: yellow;
    --color-tertiary-darker: orange;

    /* Tooltip color */
    --color-tooltip: beige;

    /* Success Color (Used for checkmarks) */
    --color-success: #28a745;

    /* Neutral & Disabled Colors */
    --color-neutral-light: #f8f9fa;
    --color-neutral-gray: #ccc;
    --color-disabled-bg: lightgray;
    --color-disabled-text: gray;

    /* Spacing & Effects */
    --border-radius-base: 4px;
    --shadow-base: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }

  html {
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }

  /*
    TASK 1 ---------------------------------------------------------------------
  */
  .contact-form__inner {
    align-items: flex-start;
  }
  
  [data-ab-element-id="injected-overlay"] {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
  }
  [data-ab-element-id="form-container"]:after 
    { /* bug fix on external styling causing layout issue on small screen size */
    content: none !important; 
    display: none !important;
  }
  [data-ab-element-id="form-container"] {
    background: var(--color-neutral-light);
    z-index: 100000; 
    visibility: hidden;  /* prevent flicker by hiding content, then showing after elements are in place */
  }

  [data-ab-element-id="injected-paragraph"] {
    color: var(--color-secondary-darker);
  }

  [data-ab-element-id="form-modal"] {
    border: none;
    border-radius: 6px;
    padding: 1.5rem;
    width: 500px;s
  }
  [data-ab-element-id="form-modal"] button {
    margin: 2px;
  }
  [data-ab-element-id="modal-body"] {
    padding: 20px 10px;
  }
  [data-ab-element-id="modal-header"], [data-ab-element-id="modal-footer"] {
    display: flex;
    justify-content: flex-end;
  }

  [data-ab-element-id="open-modal-btn"],
  [data-ab-element-id="modal-next"],
  [data-ab-element-id="modal-back"],
  [data-ab-element-id="form-container"] input[type="submit"],
  [data-ab-element-id="slider-wrapper"] .slide-button
   {
    border: none;
    border-radius: var(--border-radius-base);
    padding: 10px 20px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: var(--shadow-base);
  }

  [data-ab-element-id="injected-button-wrapper"] {
    display: flex;
    justify-content: flex-end;
  }
  [data-ab-element-id="open-modal-btn"] {
    background: var(--color-secondary);
    color: white;
  }
  [data-ab-element-id="open-modal-btn"]:hover {
    background: var(--color-secondary-dark);
  }
  [data-ab-element-id="open-modal-btn"]:active {
    background-color: var(--color-secondary-darker);
    transform: translateY(1px);
    box-shadow: none;
  }

  [data-ab-element-id="modal-next"], 
  [data-ab-element-id="modal-back"] {
    background: var(--color-primary);
    color: white;
  }
  [data-ab-element-id="modal-next"]:not(:disabled):hover,
  [data-ab-element-id="modal-back"]:not(:disabled):hover {
    background: var(--color-primary-dark);
  }
  [data-ab-element-id="modal-next"]:not(:disabled):active,
  [data-ab-element-id="modal-back"]:not(:disabled):active {
    background-color: var(--color-primary-darker);
    transform: translateY(1px);
    box-shadow: none;
  }
  [data-ab-element-id="modal-next"]:not(:disabled):focus,
  [data-ab-element-id="modal-back"]:not(:disabled):focus {
    outline: 2px solid darkgray;
    box-shadow: none;
  }
  
  [data-ab-element-id="modal-next"]:disabled, 
  [data-ab-element-id="modal-back"]:disabled {
    box-shadow: none;
    cursor: not-allowed;
    background: var(--color-disabled-bg);
    color: var(--color-disabled-text);
    transform: none;
  }

  [data-ab-element-id="form-container"] input[type="submit"] {
    background-color: var(--color-primary) !important;
    color: white !important;
    box-shadow: var(--shadow-base) !important;
  }
  [data-ab-element-id="form-container"] input[type="submit"]:hover {
    background-color: var(--color-primary-dark) !important;
  }
  [data-ab-element-id="form-container"] input[type="submit"]:active {
    background-color: var(--color-primary-darker) !important;
    transform: translateY(1px);
    box-shadow: none !important;
  }

  [data-ab-element-id="modal-close"] {
    height: 30px;
    width: 30px;
    color: var(--color-secondary-dark);
    background: transparent;
    box-shadow: none;
    padding: 0;
    border-radius: 50%;
  }
  [data-ab-element-id="modal-close"]:hover {
    background: var(--color-neutral-light);
    cursor: pointer;
  }

  /* hiding modalStep3 content */
  [data-ab-element-id="modal-step"] {
    display: none;
  }
  [data-ab-element-id="modal-step"].active {
    display: flex;
    justify-content: center;
  }

  [data-ab-element-id="progress-wrapper"] {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: 2rem;
    position: relative;
  }
  [data-ab-element-id="progress-wrapper"] .progress-step {
    flex-grow: 1;
    text-align: center;
    position: relative;
    cursor: default;
  }
  [data-ab-element-id="progress-wrapper"] .progress-step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 15px; 
    left: 50%;
    right: -50%;
    height: 2px;
    background: var(--color-neutral-gray);
    z-index: 1;
  }
  [data-ab-element-id="progress-wrapper"] .step-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--color-neutral-gray);
    color: var(--color-secondary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 5px;
    z-index: 2;
    position: relative;
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.active .step-icon {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.active .step-text {
    font-weight: bold;
    color: var(--color-primary);
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.completed .step-text {
    font-weight: bold;
    color: var(--color-primary);
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.completed:not(:last-child)::after {
    background: var(--color-primary);
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.completed .step-icon {
    background: var(--color-primary); 
    color: white;
    border-color: var(--color-primary);
  }
  [data-ab-element-id="progress-wrapper"] .progress-step.completed .icon-check {
    display: block;
  }
  [data-ab-element-id="progress-wrapper"] .icon-check {
    display: none;
    font-size: 10px;
    color: white;
    background: var(--color-success); 
    border-radius: 50%;
    width: 15px;
    height: 15px;
    line-height: 15px; 
    text-align: center;
    position: absolute; 
    top: -5px;          
    right: -5px;        
    border: 2px solid #fff; 
    z-index: 3; 
  }
  [data-ab-element-id="progress-wrapper"] .icon-number {
    display: block;
  }
  [data-ab-element-id="progress-wrapper"] .step-text {
    font-size: 0.8em;
    color: var(--color-secondary-dark);
  }


  /*
    TASK 2 ---------------------------------------------------------------------
   */
  [data-ab-element-id="sticky-container"] {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100000; 
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto; 
    transform: translateY(calc(100% - 60px));
    transition: transform 0.5s ease-in-out;
  }
  [data-ab-element-id="sticky-container"].is-open {
    transform: translateY(0);
  }

  [data-ab-element-id="sticky-header"] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px;
    cursor: pointer;
    background: var(--color-tertiary);
    color: var(--color-secondary-darker);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 2;
    order: 1; 
  }
  [data-ab-element-id="sticky-header"] .drawer-title {
    font-size: 15px;
  }
  [data-ab-element-id="sticky-header"] .controls-container {
    display: flex;
  }
  [data-ab-element-id="sticky-header"] .pagination-controls {
    display: flex;
    align-items: center;
  }
  [data-ab-element-id="sticky-header"] .page-counter {
    cursor: initial;
  }
  [data-ab-element-id="sticky-header"] .nav-arrow {
    color: var(--color-primary-dark);
    padding: 0px 10px;
    font-size: 20px;
    cursor: pointer;
  }
  [data-ab-element-id="sticky-header"] .nav-arrow:hover {
    color: var(--color-secondary);
  }
  [data-ab-element-id="sticky-header"] .nav-arrow.is-disabled {
    color: var(--color-neutral-gray);
    cursor: not-allowed;
  }
  [data-ab-element-id="sticky-header"] .chevron-icon {
      font-size: 20px;
      transition: transform 0.35s ease-out;
      margin-left: 10px;
      line-height: 1;
      display: flex;
      align-items: center;
  }
  [data-ab-element-id="sticky-container"]:not(.is-open) .pagination-controls {
    visibility: hidden;
  }
  [data-ab-element-id="sticky-container"].is-open .chevron-icon {
      transform: rotate(180deg);
  }
  [data-ab-element-id="sticky-container"].is-open [data-ab-element-id="sticky-header"] {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  [data-ab-element-id="sticky-body"] {
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    order: 2;
    max-height: 50vh;
    overflow-y: auto;
  }

  [data-ab-element-id="slider-wrapper"] {
    display: flex; 
    gap: 10px;
    scroll-padding-left: 20px;
    padding: 20px;
    overflow-x: scroll; 
    -webkit-overflow-scrolling: touch; 
    scroll-snap-type: x mandatory;   
  }
  [data-ab-element-id="slider-wrapper"] .info-card {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 280px; 
    border-radius: 8px;
    background: lightgray;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
   [data-ab-element-id="slider-wrapper"] .card-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  [data-ab-element-id="slider-wrapper"] .card-header {
    display: flex;
    align-items: center;
  }
  [data-ab-element-id="slider-wrapper"] .slide-title {
  }
  [data-ab-element-id="slider-wrapper"] .slide-tooltip {
    color: var(--color-secondary);
    cursor: pointer;
    position: relative;
    margin: 0px 5px;
    z-index: 10;
    line-height: 1;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  [data-ab-element-id="slider-wrapper"] .slide-tooltip:hover {
    background: var(--color-tooltip);
    border-radius: 50%;
  }
  [data-ab-element-id="slider-wrapper"] .tooltip-content {
    visibility: hidden;
    font-size: 10px;
    white-space: nowrap;
    max-width: 200px;
    color: var(--color-secondary);
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 10;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
  }
  [data-ab-element-id="slider-wrapper"] .tooltip-content::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-tooltip) transparent transparent transparent;
  }
  [data-ab-element-id="slider-wrapper"] .slide-tooltip:hover .tooltip-content,
  [data-ab-element-id="slider-wrapper"] .slide-tooltip:focus-within .tooltip-content { 
    visibility: visible;
    opacity: 1;
    background-color: var(--color-tooltip);
  }
  [data-ab-element-id="slider-wrapper"] .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 70px;
  }
  [data-ab-element-id="slider-wrapper"] .slide-description {
    flex-grow: 1;
    margin-bottom: 15px;
    font-size: 10px;
  }
  [data-ab-element-id="slider-wrapper"] .slide-button {
    background: var(--color-tertiary);
  }
  [data-ab-element-id="slider-wrapper"] .slide-button:hover {
    background: var(--color-tertiary-dark);
  }
  [data-ab-element-id="slider-wrapper"] .slide-button:active {
    background-color: var(--color-tertiary-darker);
    transform: translateY(1px);
    box-shadow: none;
    color: white;
  }

  /*
    TASK 3 ---------------------------------------------------------------------
   */
  [data-ab-element-id="value-prop-list"] {
    margin: 20px 0px;
    background: white;
    padding: 10px 20px;
    border-radius: var(--border-radius-base);
    box-shadow: inset 5px 5px 10px 2px rgba(0, 0, 0, 0.5);
  }
  [data-ab-element-id="bullet-point"] {
    display: flex;
    align-items: flex-start; 
    justify-content: start;
    color: black;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  [data-ab-element-id="bullet-point"] div {
    color: var(--color-success);
  }
  [data-ab-element-id="bullet-point"] span {
    margin-left: 20px;
  }
  [data-ab-element-id="header-container"] {
    height: auto !important;
  }

  /*
    RESPONSIVE STYLING (MOBILE FIRST) ----------------------------------------------
   */

  /* MOBILE (Default up to 767px) */
  [data-ab-element-id="slider-wrapper"] .info-card {
      width: calc(100% - 20px); 
  }
  
  /* TABLET (min-width: 768px) */
  @media (min-width: 768px) {
    [data-ab-element-id="slider-wrapper"] .info-card {
        width: calc(50% - 15px); 
    }
    [data-ab-element-id="header-container"] .lm-hero__left .lm-hero__image {
      width: 50% !important; 
    }
  }

  /* DESKTOP (min-width: 1024px) */
  @media (min-width: 1024px) {
    [data-ab-element-id="sticky-header"] {
      width: 400px;
      margin: 0 auto; 
    }
    [data-ab-element-id="slider-wrapper"] .info-card {
        width: calc(25% - 7.5px); 
    }
    [data-ab-element-id="sticky-body"] {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    [data-ab-element-id="sticky-container"].is-open [data-ab-element-id="sticky-header"] {
      box-shadow: none;
    }
    [data-ab-element-id="bullet-point"] div {
      padding-left: 20px;
    }
  }
`;

document.head.appendChild(style);
