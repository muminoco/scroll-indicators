import { CONFIG, ATTRIBUTES } from './config.js';

/**
 * Debug logging utility
 */
export function log(message, type = 'log', element = null) {
  if (!CONFIG.DEBUG) return;
  
  const prefix = '[Scroll Indicators]';
  const elementInfo = element ? `\nElement:` : '';
  
  if (element) {
    console[type](prefix, message, elementInfo, element);
  } else {
    console[type](prefix, message);
  }
}

/**
 * Find all scroll indicator containers in the DOM
 */
export function findScrollContainers() {
  return document.querySelectorAll(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
}

/**
 * Find the scrollable element within a container
 */
export function findScrollableElement(container) {
  const scrollableElements = container.querySelectorAll(`[${ATTRIBUTES.DIRECTION}]`);
  
  if (scrollableElements.length === 0) {
    log(`Container has no scrollable element with ${ATTRIBUTES.DIRECTION} attribute`, 'warn', container);
    return null;
  }
  
  if (scrollableElements.length > 1) {
    log(`Container has multiple scrollable elements. Using the first one.`, 'warn', container);
  }
  
  return scrollableElements[0];
}

/**
 * Find all indicator elements within a container
 */
export function findIndicators(container) {
  return container.querySelectorAll(`[${ATTRIBUTES.POSITION}]`);
}

/**
 * Find all click target elements within a container
 */
export function findClickTargets(container) {
  return container.querySelectorAll(`[${ATTRIBUTES.CLICK_TARGET}]`);
}

/**
 * Validate click target position attribute
 */
export function validateClickTargetPosition(clickTarget) {
  const position = clickTarget.getAttribute(ATTRIBUTES.CLICK_TARGET);
  
  if (!position || position.trim() === '') {
    log(`Click target missing ${ATTRIBUTES.CLICK_TARGET} attribute`, 'warn', clickTarget);
    return null;
  }
  
  const validPositions = ['start', 'end'];
  const trimmedPosition = position.trim().toLowerCase();
  
  if (!validPositions.includes(trimmedPosition)) {
    log(`Invalid click target position "${position}". Must be "start" or "end"`, 'warn', clickTarget);
    return null;
  }
  
  return trimmedPosition;
}

/**
 * Validate scroll direction attribute
 */
export function validateDirection(element) {
  const direction = element.getAttribute(ATTRIBUTES.DIRECTION);
  
  if (!direction || direction.trim() === '') {
    log(`Scrollable element missing ${ATTRIBUTES.DIRECTION} attribute`, 'error', element);
    return null;
  }
  
  const validDirections = ['horizontal', 'vertical'];
  const trimmedDirection = direction.trim().toLowerCase();
  
  if (!validDirections.includes(trimmedDirection)) {
    log(`Invalid direction "${direction}". Must be "horizontal" or "vertical"`, 'error', element);
    return null;
  }
  
  return trimmedDirection;
}

/**
 * Validate indicator position attribute
 */
export function validatePosition(indicator) {
  const position = indicator.getAttribute(ATTRIBUTES.POSITION);
  
  if (!position || position.trim() === '') {
    log(`Indicator missing ${ATTRIBUTES.POSITION} attribute`, 'warn', indicator);
    return null;
  }
  
  const validPositions = ['start', 'end'];
  const trimmedPosition = position.trim().toLowerCase();
  
  if (!validPositions.includes(trimmedPosition)) {
    log(`Invalid position "${position}". Must be "start" or "end"`, 'warn', indicator);
    return null;
  }
  
  return trimmedPosition;
}

/**
 * Check if element is at scroll start
 */
export function isAtStart(element, direction) {
  const scrollPosition = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
  return scrollPosition <= CONFIG.SCROLL_THRESHOLD;
}

/**
 * Check if element is at scroll end
 */
export function isAtEnd(element, direction) {
  if (direction === 'horizontal') {
    const maxScroll = element.scrollWidth - element.clientWidth;
    return element.scrollLeft >= maxScroll - CONFIG.SCROLL_THRESHOLD;
  } else {
    const maxScroll = element.scrollHeight - element.clientHeight;
    return element.scrollTop >= maxScroll - CONFIG.SCROLL_THRESHOLD;
  }
}

/**
 * Parse scroll amount string into pixels
 */
export function parseScrollAmount(scrollAmount, element, direction, container) {
  if (!scrollAmount || scrollAmount.trim() === '') {
    return CONFIG.DEFAULT_SCROLL.SCROLL_TO_END ? 'end' : parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
  }
  
  const amount = scrollAmount.trim().toLowerCase();
  
  // Handle "end" case
  if (amount === 'end') {
    return 'end';
  }
  
  // Parse pixel values
  if (amount.endsWith('px')) {
    const pixels = parseFloat(amount);
    if (isNaN(pixels)) {
      log(`Invalid pixel value "${scrollAmount}". Using default.`, 'warn');
      return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
    }
    return Math.abs(pixels); // Use absolute value for negative numbers
  }
  
  // Parse percentage values (based on container size)
  if (amount.endsWith('%')) {
    const percentage = parseFloat(amount);
    if (isNaN(percentage)) {
      log(`Invalid percentage value "${scrollAmount}". Using default.`, 'warn');
      return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
    }
    
    if (!container) {
      log(`Cannot calculate percentage without container reference. Using default.`, 'warn');
      return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
    }
    
    const containerSize = direction === 'horizontal' ? container.clientWidth : container.clientHeight;
    return Math.abs((percentage / 100) * containerSize);
  }
  
  // Parse rem values
  if (amount.endsWith('rem')) {
    const rems = parseFloat(amount);
    if (isNaN(rems)) {
      log(`Invalid rem value "${scrollAmount}". Using default.`, 'warn');
      return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
    }
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return Math.abs(rems * rootFontSize);
  }
  
  // Parse em values
  if (amount.endsWith('em')) {
    const ems = parseFloat(amount);
    if (isNaN(ems)) {
      log(`Invalid em value "${scrollAmount}". Using default.`, 'warn');
      return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
    }
    const elementFontSize = parseFloat(getComputedStyle(element).fontSize);
    return Math.abs(ems * elementFontSize);
  }
  
  // Invalid format
  log(`Invalid scroll amount format "${scrollAmount}". Must be px, rem, em, %, or "end". Using default.`, 'warn');
  return parseScrollAmount(CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT, element, direction, container);
}

/**
 * Perform scroll action
 */
export function performScroll(element, direction, scrollAmount, indicatorPosition, container) {
  const parsedAmount = parseScrollAmount(scrollAmount, element, direction, container);
  
  let scrollOptions = {
    behavior: CONFIG.SCROLL_BEHAVIOR
  };
  
  if (parsedAmount === 'end') {
    // Scroll to absolute start or end
    if (direction === 'horizontal') {
      scrollOptions.left = indicatorPosition === 'start' ? 0 : element.scrollWidth;
    } else {
      scrollOptions.top = indicatorPosition === 'start' ? 0 : element.scrollHeight;
    }
  } else {
    // Scroll by specified amount
    const currentPosition = direction === 'horizontal' ? element.scrollLeft : element.scrollTop;
    const scrollDirection = indicatorPosition === 'start' ? -1 : 1;
    const newPosition = currentPosition + (parsedAmount * scrollDirection);
    
    if (direction === 'horizontal') {
      scrollOptions.left = Math.max(0, newPosition);
    } else {
      scrollOptions.top = Math.max(0, newPosition);
    }
  }
  
  element.scrollTo(scrollOptions);
}