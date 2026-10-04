/* Hariyo Waste accessibility preferences and shared skip navigation. */
(function () {
  'use strict';

  const STORAGE_KEY = 'hariyo_accessibility_v1';
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const defaults = { textLevel: 0, highContrast: false, colorblind: false, reduceMotion: false, underlineLinks: false };
  let preferences = { ...defaults };
  let generatedId = 0;
  let liveRegion = null;

  function announce(message) {
    if (!message) return;
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'wms-accessibility-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = '';
    requestAnimationFrame(() => {
      liveRegion.textContent = message;
    });
  }

  try {
    preferences = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch (_) {
    preferences = { ...defaults };
  }

  function applyPreferences() {
    const root = document.documentElement;
    root.style.fontSize = `${100 + Math.max(-1, Math.min(5, preferences.textLevel)) * 10}%`;
    root.classList.toggle('a11y-high-contrast', preferences.highContrast);
    root.classList.toggle('a11y-colorblind', preferences.colorblind);
    root.classList.toggle('a11y-reduce-motion', preferences.reduceMotion || motionQuery.matches);
    root.classList.toggle('a11y-underline-links', preferences.underlineLinks);
  }

  function savePreferences() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch (_) {}
    applyPreferences();
    updateControls();

    const active = Object.entries(preferences)
      .filter(([key, value]) => key !== 'textLevel' && value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
    const textSetting = `${100 + preferences.textLevel * 10}%`;
    const summary = active.length
      ? `Accessibility settings updated. Active options: ${active.join(', ')}. Text size: ${textSetting}.`
      : `Accessibility settings updated. Text size: ${textSetting}.`;
    announce(summary);
  }

  function updateControls() {
    const textSize = document.getElementById('a11y-text-size');
    if (textSize) textSize.textContent = `${100 + preferences.textLevel * 10}%`;
    document.querySelectorAll('[data-a11y-toggle]').forEach((control) => {
      const key = control.getAttribute('data-a11y-toggle');
      control.setAttribute('aria-pressed', String(Boolean(preferences[key])));
    });
  }

  function reportFormValidity(form) {
    form.querySelectorAll('.field-error').forEach((error) => {
      form.querySelectorAll('[aria-describedby]').forEach((control) => {
        const ids = control.getAttribute('aria-describedby').split(/\s+/).filter((id) => id !== error.id);
        if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
        else control.removeAttribute('aria-describedby');
      });
      error.remove();
    });
    form.querySelectorAll('.field-invalid').forEach((field) => field.classList.remove('field-invalid'));
    form.querySelectorAll('[aria-invalid="true"]').forEach((control) => control.removeAttribute('aria-invalid'));

    const controls = Array.from(form.elements).filter((control) => control.willValidate && !control.disabled);
    const invalid = controls.filter((control) => !control.validity.valid ||
      (control.required && typeof control.value === 'string' && !control.value.trim()));
    if (!invalid.length) return true;

    const radioGroups = new Set();
    invalid.forEach((control) => {
      const groupKey = control.type === 'radio' && control.name ? control.name : null;
      if (groupKey && radioGroups.has(groupKey)) return;
      if (groupKey) radioGroups.add(groupKey);
      const field = control.closest('.field') || control.parentElement;
      const error = document.createElement('p');
      error.className = 'field-error';
      error.id = `wms-error-${++generatedId}`;
      const groupLabel = groupKey ? control.closest('fieldset')?.querySelector('legend')?.textContent : '';
      const label = (groupLabel || control.labels?.[0]?.textContent || '').replace(/\*/g, '').trim();
      error.textContent = control.validity.valueMissing || (control.required && !String(control.value || '').trim())
        ? `${label || 'This field'} is required.`
        : control.type === 'email' && control.validity.typeMismatch
          ? 'Enter a valid email address.'
          : control.validationMessage;
      if (field) {
        field.classList.add('field-invalid');
        field.appendChild(error);
      }
      const group = groupKey ? Array.from(form.elements).filter((item) => item.name === groupKey) : [control];
      group.forEach((item) => {
        item.setAttribute('aria-invalid', 'true');
        const describedBy = (item.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        item.setAttribute('aria-describedby', [...describedBy, error.id].join(' '));
      });
    });
    invalid[0].focus();
    return false;
  }

  function enhanceControls(root) {
    root.querySelectorAll('.field').forEach((field) => {
      const controls = field.querySelectorAll('input:not([type="hidden"]), select, textarea');
      controls.forEach((control) => {
        if (control.labels && control.labels.length) return;
        const label = field.querySelector(':scope > label') || field.querySelector('label');
        if (!label || control.type === 'radio' || control.type === 'checkbox') return;
        if (!control.id) control.id = `wms-control-${++generatedId}`;
        label.htmlFor = control.id;
      });
      const hint = field.querySelector('.hint');
      if (hint) {
        if (!hint.id) hint.id = `wms-hint-${++generatedId}`;
        controls.forEach((control) => {
          const describedBy = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
          if (!describedBy.includes(hint.id)) control.setAttribute('aria-describedby', [...describedBy, hint.id].join(' '));
        });
      }
      const required = field.querySelector('[required]');
      const label = field.querySelector(':scope > label');
      if (required && label && !label.textContent.includes('*')) {
        const marker = document.createElement('span');
        marker.className = 'required-indicator';
        marker.setAttribute('aria-hidden', 'true');
        marker.textContent = ' *';
        label.appendChild(marker);
      }
    });

    root.querySelectorAll('input[placeholder]:not([type="hidden"]), select, textarea').forEach((control) => {
      if (!control.labels?.length && !control.hasAttribute('aria-label')) {
        const hint = control.getAttribute('placeholder');
        if (hint) control.setAttribute('aria-label', hint.replace(/[.…]+$/, ''));
      }
    });

    root.querySelectorAll('table').forEach((table) => {
      table.querySelectorAll('thead th').forEach((heading) => {
        if (!heading.hasAttribute('scope')) heading.setAttribute('scope', 'col');
        if (!heading.textContent.trim()) heading.textContent = 'Actions';
      });
    });

    const tableRegions = root.matches?.('.table-wrap') ? [root] : [];
    tableRegions.push(...root.querySelectorAll('.table-wrap'));
    tableRegions.forEach((region) => {
      if (!region.querySelector('table')) return;
      region.tabIndex = 0;
      region.setAttribute('role', 'region');
      if (!region.hasAttribute('aria-label')) {
        const title = region.closest('.modal')?.querySelector('.modal-head h3')?.textContent.trim() ||
          region.closest('main')?.querySelector('.view-head h2')?.textContent.trim();
        region.setAttribute('aria-label', title ? `${title} data table` : 'Data table');
      }
    });

    const toolbars = root.matches?.('.toolbar') ? [root] : [];
    toolbars.push(...root.querySelectorAll('.toolbar'));
    toolbars.forEach((toolbar) => {
      toolbar.querySelectorAll('[data-role="search"], [data-role="filter"]').forEach((control) => {
        if (control.closest('.toolbar-field')) return;
        const title = toolbar.closest('main')?.querySelector('.view-head h2')?.textContent.trim().toLowerCase();
        const label = document.createElement('label');
        label.className = 'toolbar-field';
        label.textContent = control.dataset.role === 'search'
          ? (control.placeholder || 'Search').replace(/[.…]+$/, '')
          : `Filter ${title || 'results'} by`;
        const wrapper = control.matches('[data-role="search"]') ? control.closest('.input') || control : control;
        wrapper.parentNode.insertBefore(label, wrapper);
        label.appendChild(wrapper);
        control.removeAttribute('aria-label');
      });
    });

    root.querySelectorAll('button[data-action^="view-"], button[data-action^="edit-"], button[data-action^="del-"]').forEach((button) => {
      const [action, entity] = button.dataset.action.split('-');
      const word = action === 'del' ? 'Delete' : action[0].toUpperCase() + action.slice(1);
      const row = button.closest('tr, .list-item');
      const name = row?.querySelector('.title')?.textContent.trim() ||
        (entity === 'business' ? row?.cells?.[1]?.textContent.trim() : '') || button.dataset.id || '';
      button.setAttribute('aria-label', `${word} ${entity} ${name}`.trim());
    });

    root.querySelectorAll('svg:not([aria-hidden])').forEach((svg) => {
      if (!svg.querySelector('title')) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      }
    });

    root.querySelectorAll('form').forEach((form) => {
      if (form.querySelector('[required]') && !form.querySelector('.required-note')) {
        const note = document.createElement('p');
        note.className = 'required-note';
        note.textContent = 'Fields marked with * are required.';
        const heading = form.querySelector('h1, h2, h3');
        if (heading) heading.insertAdjacentElement('afterend', note);
        else form.insertBefore(note, form.firstChild);
      }
      if (form.dataset.accessibilityValidation) return;
      form.dataset.accessibilityValidation = 'true';
      form.noValidate = true;
      form.addEventListener('submit', (event) => {
        if (reportFormValidity(form)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
      const clearError = (event) => {
        const control = event.target;
        if (!control.matches('input, select, textarea') || !control.validity.valid) return;
        const field = control.closest('.field');
        if (!field) return;
        field.querySelectorAll('.field-error').forEach((error) => {
          field.querySelectorAll('[aria-describedby]').forEach((item) => {
            const ids = item.getAttribute('aria-describedby').split(/\s+/).filter((id) => id !== error.id);
            if (ids.length) item.setAttribute('aria-describedby', ids.join(' '));
            else item.removeAttribute('aria-describedby');
          });
          error.remove();
        });
        field.classList.remove('field-invalid');
        field.querySelectorAll('[aria-invalid="true"]').forEach((item) => item.removeAttribute('aria-invalid'));
      };
      form.addEventListener('input', clearError);
      form.addEventListener('change', clearError);
    });
  }

  function mount() {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
    function updateSkipTarget() {
      const main = Array.from(document.querySelectorAll('main, [role="main"], #dashContent'))
        .find((candidate) => !candidate.closest('[hidden], .hidden')) ||
        document.querySelector('#gate, #root');
      if (!main) return;
      if (!main.id) main.id = 'main-content';
      if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
      skip.href = `#${main.id}`;
    }
    updateSkipTarget();

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'a11y-trigger';
    trigger.id = 'a11y-trigger';
    trigger.textContent = 'Accessibility';
    trigger.setAttribute('aria-label', 'Open accessibility settings');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'a11y-panel');

    function placeTriggerAwayFrom(target) {
      if (!target || target === trigger || panel?.contains(target)) return;
      const targetRect = target.getBoundingClientRect?.();
      if (!targetRect || !targetRect.width || !targetRect.height) return;
      const positions = ['bottom-right', 'top-right', 'top-left', 'bottom-left'];
      let bestPosition = positions[0];
      let leastOverlap = Infinity;
      for (const position of positions) {
        if (position === 'bottom-right') delete trigger.dataset.position;
        else trigger.dataset.position = position;
        const rect = trigger.getBoundingClientRect();
        const overlapWidth = Math.max(0, Math.min(rect.right, targetRect.right) - Math.max(rect.left, targetRect.left));
        const overlapHeight = Math.max(0, Math.min(rect.bottom, targetRect.bottom) - Math.max(rect.top, targetRect.top));
        const overlap = overlapWidth * overlapHeight;
        if (overlap < leastOverlap) {
          leastOverlap = overlap;
          bestPosition = position;
        }
        if (!overlap) break;
      }
      if (bestPosition === 'bottom-right') delete trigger.dataset.position;
      else trigger.dataset.position = bestPosition;
      if (panel && !panel.hidden) panel.dataset.position = bestPosition;
    }

    const panel = document.createElement('section');
    panel.className = 'a11y-panel';
    panel.id = 'a11y-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Accessibility settings panel');
    panel.setAttribute('aria-labelledby', 'a11y-title');
    panel.innerHTML = `
      <div class="a11y-panel-head">
        <h2 id="a11y-title">Accessibility settings</h2>
        <button type="button" class="a11y-close" aria-label="Close accessibility settings">Close</button>
      </div>
      <div class="a11y-size-row">
        <span>Text size</span>
        <button type="button" data-a11y-action="decrease" aria-label="Decrease text size">A−</button>
        <output id="a11y-text-size" aria-live="polite"></output>
        <button type="button" data-a11y-action="increase" aria-label="Increase text size">A+</button>
      </div>
      <button type="button" class="a11y-option" data-a11y-toggle="highContrast" aria-pressed="false">High contrast</button>
      <button type="button" class="a11y-option" data-a11y-toggle="colorblind" aria-pressed="false">Color-blind friendly status styles</button>
      <button type="button" class="a11y-option" data-a11y-toggle="reduceMotion" aria-pressed="false">Reduce animations</button>
      <button type="button" class="a11y-option" data-a11y-toggle="underlineLinks" aria-pressed="false">Underline links</button>
      <p class="a11y-note">Your device's reduced-motion setting is always respected.</p>
      <button type="button" class="a11y-reset" data-a11y-action="reset">Reset settings</button>`;

    document.body.insertBefore(trigger, skip.nextSibling);
    document.body.insertBefore(panel, trigger.nextSibling);

    const closeButton = panel.querySelector('.a11y-close');
    function setOpen(open, returnFocus) {
      panel.hidden = !open;
      panel.dataset.position = trigger.dataset.position || 'bottom-right';
      trigger.setAttribute('aria-expanded', String(open));
      if (open) closeButton.focus();
      else if (returnFocus) trigger.focus();
    }

    trigger.addEventListener('click', () => setOpen(panel.hidden, false));
    closeButton.addEventListener('click', () => setOpen(false, true));
    document.addEventListener('focusin', (event) => placeTriggerAwayFrom(event.target));
    window.addEventListener('resize', () => placeTriggerAwayFrom(document.activeElement));
    panel.addEventListener('click', (event) => {
      const control = event.target.closest('[data-a11y-toggle], [data-a11y-action]');
      if (!control) return;
      const key = control.getAttribute('data-a11y-toggle');
      const action = control.getAttribute('data-a11y-action');
      if (key) preferences[key] = !preferences[key];
      if (action === 'increase') preferences.textLevel = Math.min(5, preferences.textLevel + 1);
      if (action === 'decrease') preferences.textLevel = Math.max(-1, preferences.textLevel - 1);
      if (action === 'reset') preferences = { ...defaults };
      savePreferences();
    });
    document.addEventListener('click', (event) => {
      const saveButton = event.target.closest?.('button[id$="Save"]');
      const form = saveButton?.closest('.modal')?.querySelector('form');
      if (!form || reportFormValidity(form)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
    });
    motionQuery.addEventListener?.('change', applyPreferences);
    enhanceControls(document);
    new MutationObserver((changes) => {
      changes.forEach((change) => change.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enhanceControls(node);
      }));
      updateSkipTarget();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    applyPreferences();
    updateControls();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
