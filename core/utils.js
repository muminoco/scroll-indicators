import { CONFIG, ATTRIBUTES } from './config.js';

/**
 * Utility functions for scroll indicators
 */

// Get all containers with scroll indicators
export function getScrollContainers() {
  return document.querySelectorAll(`[${ATTRIBUTES.DIRECTION}]`);
}

// Get indicator elements for a container
export function getIndicators(container, position) {
  const indicators = container.querySelectorAll(`[${ATTRIBUTES.POSITION}="${position}"]`);
  return indicators;
}

// Get scroll items within a container
export function getScrollItems(container) {
  return container.querySelectorAll(`[${ATTRIBUTES.ITEM}]`);
}

// Calculate item-based scroll positions
export function getItemPositions(container, direction) {
  const items = getScrollItems(container);
  if (items.length === 0) {
    debugLog('No scroll items found in container', container);
    return [];
  }
  
  const positions = Array.from(items).map(item => {
    if (direction === 'horizontal') {
      return item.offsetLeft;
    } else {
      return item.offsetTop;
    }
  });
  
  debugLog('Item positions:', positions);
  return positions;
}

// Find the currently visible item index
export function getCurrentItemIndex(container, direction, scrollInfo) {
  const positions = getItemPositions(container, direction);
  if (positions.length === 0) return -1;
  
  const currentScroll = scrollInfo.current;
  
  // Find the closest item to current scroll position
  let closestIndex = 0;
  let closestDistance = Math.abs(positions[0] - currentScroll);
  
  for (let i = 1; i < positions.length; i++) {
    const distance = Math.abs(positions[i] - currentScroll);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }
  
  return closestIndex;
}

// Calculate next item scroll amount
export function calculateNextItemScroll(container, direction, scrollInfo, nextAmount, isForward) {
  const positions = getItemPositions(container, direction);
  if (positions.length === 0) {
    console.warn('[Scroll Indicators] No items found for next-item scrolling. Add data-scroll-indicators-item attributes to elements.');
    return 0;
  }
  
  const currentIndex = getCurrentItemIndex(container, direction, scrollInfo);
  let targetIndex;
  
  if (isForward) {
    targetIndex = Math.min(currentIndex + nextAmount, positions.length - 1);
  } else {
    targetIndex = Math.max(currentIndex - nextAmount, 0);
  }
  
  debugLog('Item scroll calculation:', {
    currentIndex,
    targetIndex,
    nextAmount,
    isForward,
    totalItems: positions.length
  });
  
  const targetPosition = positions[targetIndex];
  const currentPosition = scrollInfo.current;
  
  return targetPosition - currentPosition;
}

// Find the scroll container for an indicator element
export function findScrollContainer(indicator) {
  // Look for the closest ancestor with scroll indicators direction attribute
  const container = indicator.closest(`[${ATTRIBUTES.DIRECTION}]`);
  
  if (!container) {
    console.error('[Scroll Indicators] Indicator could not find parent scroll container:', indicator);
    console.error(`Make sure the indicator is inside an element with ${ATTRIBUTES.DIRECTION} attribute`);
    return null;
  }
  
  return container;
}
export function parseCSSValue(value, containerSize) {
  if (typeof value !== 'string') return 0;
  
  value = value.trim();
  
  if (value.endsWith('px')) {
    return parseFloat(value);
  } else if (value.endsWith('%')) {
    return (parseFloat(value) / 100) * containerSize;
  } else if (value.endsWith('rem')) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(value) * rootFontSize;
  } else if (value.endsWith('em')) {
    const containerFontSize = parseFloat(getComputedStyle(document.body).fontSize);
    return parseFloat(value) * containerFontSize;
  } else if (value.endsWith('vw')) {
    return (parseFloat(value) / 100) * window.innerWidth;
  } else if (value.endsWith('vh')) {
    return (parseFloat(value) / 100) * window.innerHeight;
  }
  
  // Fallback: try to parse as number (assume pixels)
  const numValue = parseFloat(value);
  return isNaN(numValue) ? 0 : numValue;
}

// Get scroll position info
export function getScrollInfo(container, direction) {
  const threshold = CONFIG.SCROLL_THRESHOLD;
  
  if (direction === 'horizontal') {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    return {
      current: scrollLeft,
      max: maxScroll,
      isAtStart: scrollLeft <= threshold,
      isAtEnd: scrollLeft >= maxScroll - threshold,
      containerSize: container.clientWidth
    };
  } else {
    const scrollTop = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    
    return {
      current: scrollTop,
      max: maxScroll,
      isAtStart: scrollTop <= threshold,
      isAtEnd: scrollTop >= maxScroll - threshold,
      containerSize: container.clientHeight
    };
  }
}

// Calculate scroll amount based on configuration
export function calculateScrollAmount(scrollAmount, containerSize, scrollInfo) {
  if (scrollAmount === 'end' || scrollAmount === 'start') {
    return scrollAmount === 'start' ? -scrollInfo.max : scrollInfo.max;
  }
  
  // Parse as CSS value
  const amount = parseCSSValue(scrollAmount, containerSize);
  return amount;
}

// Scroll the container
export function scrollContainer(container, amount, direction) {
  const scrollOptions = {
    behavior: CONFIG.SCROLL_BEHAVIOR
  };
  
  if (direction === 'horizontal') {
    container.scrollBy({
      left: amount,
      ...scrollOptions
    });
  } else {
    container.scrollBy({
      top: amount,
      ...scrollOptions
    });
  }
}

// Debug logging
export function debugLog(...args) {
  if (CONFIG.DEBUG) {
    console.log('[Scroll Indicators]', ...args);
  }
}

// Validate container setup
export function validateContainer(container) {
  const direction = container.getAttribute(ATTRIBUTES.DIRECTION);
  
  if (!direction || !['horizontal', 'vertical'].includes(direction)) {
    console.warn(`[Scroll Indicators] Container missing or invalid direction attribute:`, container);
    console.warn(`Add ${ATTRIBUTES.DIRECTION}="horizontal" or "vertical" to the container`);
    return false;
  }
  
  return true;
}

// Validate indicator setup
export function validateIndicator(indicator) {
  const position = indicator.getAttribute(ATTRIBUTES.POSITION);
  const scrollAmount = indicator.getAttribute(ATTRIBUTES.SCROLL);
  
  if (!position || !['start', 'end'].includes(position)) {
    console.error('[Scroll Indicators] Indicator missing or invalid position attribute:', indicator);
    console.error(`Add ${ATTRIBUTES.POSITION}="start" or "end" to the indicator`);
    return false;
  }
  
  // Validate next-item scrolling setup
  if (scrollAmount === 'next') {
    const container = findScrollContainer(indicator);
    if (container) {
      const items = getScrollItems(container);
      if (items.length === 0) {
        console.warn('[Scroll Indicators] Next-item scrolling enabled but no items found in container:', container);
        console.warn(`Add ${ATTRIBUTES.ITEM} attributes to scrollable elements`);
      }
    }
  }
  
  const container = findScrollContainer(indicator);
  if (!container) {
    return false; // Error already logged in findScrollContainer
  }
  
  return true;
}