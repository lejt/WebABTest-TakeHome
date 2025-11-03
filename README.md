# A/B Testing/Conversion Rate Optimization (CRO) Implementation Summary

This project implements three complex front-end tasks using pure JavaScript (within an IIFE structure), CSS injection, and the MutationObserver API to ensure persistence and functionality across all modern browsers and viewport sizes, particularly on Single Page Applications (SPA).

## ⚙️ Core Technical Approach

1. Flicker Prevention and Scope Isolation (IIFE)
2. SPA Persistence (MutationObserver)

## 🎯 Task 1: Dynamic Multi-Step Contact Modal

This task replaces the static embedded HubSpot form with a modern, multi-step contact flow designed to reduce initial form friction and increase completion rates.

### Features

Form Replacement: The original form area is replaced with a call-to-action (CTA) section featuring a header, paragraph, and a custom-styled button.

Modal & Overlay: A native HTML <dialog> element is used for the modal, controlled by an overlay that handles closing via clicking outside the modal area.

Three Steps: The original form fields are segmented:

Contact Info: First Name, Last Name, Email.

Your Request: "How can we help you" field, Legal Checkbox, and Submit button.

Confirmation: Simple "Thank you" message shown after successful form submission.

Progress Bar: A dynamic progress indicator is included at the top of the modal with three distinct states, achieved entirely via CSS:

Active: Blue background, bold text.

Completed: Blue background, green checkmark icon, and bold text.

Inactive/Future: White background, gray borders.

Validation: Users are prevented from advancing to the next step until all required fields in the current step are valid. Users can navigate back to completed steps.

Responsiveness: All components are built using Flexbox to ensure clean stacking and alignment on mobile (375px+) and maintain a centered layout on desktop.

## 🛠️ Task 2: Sticky Footer Drawer with Slider

This component adds a non-intrusive, interactive content layer to the bottom of the page, promoting secondary content via a dynamic slider.

### Features

Sticky Drawer: A position: fixed drawer is placed at the bottom of the viewport, initially collapsed.

Toggle Mechanism: Clicking the header toggles the drawer state (is-open), triggering a 180-degree rotation animation on the chevron icon and a sliding animation on the main drawer body.

Overlay: When open, a page overlay is applied. Clicking the overlay or scrolling to the bottom of the main page automatically closes the drawer.

Dynamic Slider: The body contains a horizontally scrolling slider (built with Flexbox and CSS Scroll Snap for smooth native swiping on mobile).

Content Cards: Slides are dynamically created by looping through JSON data fetched from a public API (e.g., Pokémon API). Each slide includes a header, description, image, and a button.

Responsive Views:

Desktop: Shows 4 slides.

Tablet (768px+): Shows 2 slides.

Mobile (375px+): Shows 1 slide (full-width), optimized for horizontal swiping.

Navigation: Pagination controls (page counter and arrows) appear when the drawer is open to allow horizontal navigation.

## 🖥️ Task 3: Single-Page Application DOM Manipulation

This task involves targeted content updates in the main Hero section of the SPA, ensuring these modifications are persistent across route changes.

### Modifications

H1 Text Update: Changed the primary heading to: "We are the best experimentation agency in the world".

Value Proposition List: A list of five key value props is injected directly beneath the H1, providing immediate, scannable benefits to the user.

Button Text Update: The primary CTA text is updated from "Request a demo" to "Contact us".

Link Overwrite: The "Why Liftmap?" button/link is overwritten to anchor the user down to the "Why Liftmap" section on the same page, with a smooth scrolling effect.

Persistence: All modifications are maintained seamlessly as the user navigates between the "Overview" and "Plans" routes, leveraging the MutationObserver architecture.
