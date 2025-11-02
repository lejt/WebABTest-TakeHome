const style = document.createElement('style');
style.textContent = `
  :root {
    /* Primary Brand Color (Used for progress bar, Next/Back buttons) */
    --color-primary: #007bff; 
    --color-primary-dark: dodgerblue;
    --color-primary-darker: mediumblue;

    /* Secondary Button Color (Used for open-modal-btn) */
    --color-secondary: black;
    --color-secondary-dark: gray;
    --color-secondary-darker: darkslategray;

    /* Success Color (Used for checkmark) */
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

  .contact-form__inner {
    align-items: flex-start;
  }
  
  [data-ab-element-id="injected-overlay"] {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
  }
  .contact-form__form:after { /* bug fix on external styling causing layout issue on small screen size */
    content: none !important; 
    display: none !important;
  }
  [data-ab-element-id="form-container"] {
    background: var(--color-neutral-light);
    z-index: 100000; 
    visibility: hidden;  /* prevent flicker by hiding content, then showing after elements are in place */
  }

  [data-ab-element-id="injected-paragraph"] {
    color: darkgray;
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
  .hbspt-form input[type="submit"] {
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

  .hs_submit input[type="submit"] {
    background-color: var(--color-primary) !important;
    color: white !important;
    box-shadow: var(--shadow-base) !important;
  }
  .hs_submit input[type="submit"]:hover {
    background-color: var(--color-primary-dark) !important;
  }
  .hs_submit input[type="submit"]:active {
    background-color: var(--color-primary-darker) !important;
    transform: translateY(1px);
    box-shadow: none !important;
  }

  [data-ab-element-id="modal-close"] {
    height: 30px;
    width: 30px;
    color: gray;
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
  .progress-step {
    flex-grow: 1;
    text-align: center;
    position: relative;
    cursor: default;
  }
  .progress-step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 15px; 
    left: 50%;
    right: -50%;
    height: 2px;
    background: var(--color-neutral-gray);
    z-index: 1;
  }
  .step-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--color-neutral-gray);
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 5px;
    z-index: 2;
    position: relative;
  }

  .progress-step.active .step-icon {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  .progress-step.active .step-text {
    font-weight: bold;
    color: var(--color-primary);
  }

  .progress-step.completed .step-text {
    font-weight: bold;
    color: var(--color-primary);
  }
  .progress-step.completed:not(:last-child)::after {
    background: var(--color-primary);
  }
  .progress-step.completed .step-icon {
    background: var(--color-primary); 
    color: white;
    border-color: var(--color-primary);
  }
  .progress-step.completed .icon-check {
    display: block;
  }

  .icon-check {
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
  .icon-number {
    display: block;
  }
  .step-text {
    font-size: 0.8em;
    color: #999;
  }

  /* task 2 */
  [data-ab-element-id="sticky-container"] {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000; 
    max-width: 1200px;
    margin: 0 auto; 
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
    display: flex;
    flex-direction: column;
  }
  [data-ab-element-id="sticky-container"].is-open {
    transform: translateY(0) !important; 
  }

  [data-ab-element-id="sticky-header"] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 300px;
    margin: 0 auto;
    padding: 20px 10px;
    cursor: pointer;
    background: red;
    color: white;
    font-size: 10px;
    font-weight: bold;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 2;
    order: 1; 
  }
  .chevron-icon {
    font-size: 30px;
    transition: transform 0.35s ease-out;
    margin-left: 10px;
    line-height: 1;
    display: block;
  }
  [data-ab-element-id="sticky-container"].is-open .chevron-icon {
    transform: rotate(180deg);
  }

  [data-ab-element-id="sticky-body"] {
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    max-height: 50vh; 
    overflow-y: hidden;
    padding: 0;
    order: 2;
  }
  [data-ab-element-id="slider-wrapper"] {
    display: flex; 
    gap: 10px;
    padding: 10px; 
    overflow-x: scroll; 
    -webkit-overflow-scrolling: touch; 
  }

  .info-card {
    width: 280px; 
    height: 180px; 
    border-radius: 8px;
    background: lightgray;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .card-content-wrapper {
    display: flex;
    flex-direction: column;
  }
  .card-header {
    display: flex;
  }
  .slide-title {
  }
  .slide-tooltip {
    color: var(--color-secondary);
  }
  .image-container {
  }
  .slide-description {
  }
  .slide-button {
    padding: 5px 10px;
    background: yellow;
    color: var(--color-secondary);
    cursor: pointer;
  }
`;

document.head.appendChild(style);
