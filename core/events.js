import { CONFIG, ATTRIBUTES } from './config.js';
import { 
  getIndicators, 
  getScrollInfo, 
  calculateScrollAmount,
  calculateNextItemScroll,
  scrollContainer, 
  findScrollContainer,
  validateIndicator,
  debugLog 
} from './utils.js';

/**
 * Event handlers for scroll indicators
 */

// Update indicator visibility based on scroll position
export function updateIndicators(container) {
  const direction = container.getAttribute(ATTRIBUTES.DIRECTION);
  const scrollInfo = getScrollInfo(container, direction);
  
  debugLog('Updating indicators for', container.id, scrollInfo);
  
  // Update start indicators (left/top)
  const startIndicators = getIndicators(container, 'start');
  startIndicators.forEach(indicator => {
    if (scrollInfo.isAtStart) {
      indicator.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
      indicator.classList.add(CONFIG.CSS_CLASSES.HIDDEN);
    } else {
      indicator.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
      indicator.classList.remove(CONFIG.CSS_CLASSES.HIDDEN);
    }
  });
  
  // Update end indicators (right/bottom)
  const endIndicators = getIndicators(container, 'end');
  endIndicators.forEach(indicator => {
    if (scrollInfo.isAtEnd) {
      indicator.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
      indicator.classList.add(CONFIG.CSS_CLASSES.HIDDEN);
    } else {
      indicator.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
      indicator.classList.remove(CONFIG.CSS_CLASSES.HIDDEN);
    }
  });
}

// Handle scroll events
export function handleScroll(event) {
  const container = event.target;
  updateIndicators(container);
}

// Handle indicator clicks
export function handleIndicatorClick(event) {
  const indicator = event.currentTarget;
  const container = findScrollContainer(indicator);
  
  if (!container) {
    return; // Error already logged in findScrollContainer
  }
  
  const position = indicator.getAttribute(ATTRIBUTES.POSITION);
  const scrollAmount = indicator.getAttribute(ATTRIBUTES.SCROLL) || CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT;
  const nextAmount = parseInt(indicator.getAttribute(ATTRIBUTES.NEXT_AMOUNT)) || 1;
  
  const direction = container.getAttribute(ATTRIBUTES.DIRECTION);
  const scrollInfo = getScrollInfo(container, direction);
  
  debugLog('Indicator clicked:', {
    position,
    scrollAmount,
    nextAmount,
    direction
  });
  
  let amount;
  
  // Handle next-item scrolling
  if (scrollAmount === 'next') {
    const isForward = position === 'end';
    amount = calculateNextItemScroll(container, direction, scrollInfo, nextAmount, isForward);
  }
  // Handle other scroll types
  else if (position === 'start') {
    if (scrollAmount === 'end') {
      amount = -scrollInfo.current; // Scroll to very beginning
    } else {
      amount = -calculateScrollAmount(scrollAmount, scrollInfo.containerSize, scrollInfo);
    }
  } else if (position === 'end') {
    if (scrollAmount === 'end') {
      amount = scrollInfo.max - scrollInfo.current; // Scroll to very end
    } else {
      amount = calculateScrollAmount(scrollAmount, scrollInfo.containerSize, scrollInfo);
    }
  }
  
  scrollContainer(container, amount, direction);
  
  // Update indicators after scroll (with slight delay for smooth scrolling)
  setTimeout(() => updateIndicators(container), 100);
}

// Set up scroll event listeners
export function setupScrollListeners(containers) {
  containers.forEach(container => {
    container.addEventListener('scroll', handleScroll, { passive: true });
    debugLog('Scroll listener added to', container.id);
  });
}

// Set up click event listeners for indicators
export function setupClickListeners() {
  // Find all containers that have click enabled
  const clickEnabledContainers = document.querySelectorAll(`[${ATTRIBUTES.CLICK}="true"]`);
  
  clickEnabledContainers.forEach(container => {
    // Find all indicators within this container
    const indicators = container.querySelectorAll(`[${ATTRIBUTES.POSITION}]`);
    
    indicators.forEach(indicator => {
      // Validate indicator before setting up listener
      if (!validateIndicator(indicator)) {
        return;
      }
      
      indicator.addEventListener('click', handleIndicatorClick);
      indicator.style.cursor = 'pointer';
      
      debugLog('Click listener added to indicator in container:', container);
    });
  });
}

// Handle window resize (update indicators in case content changes)
export function handleResize() {
  const containers = document.querySelectorAll(`[${ATTRIBUTES.DIRECTION}]`);
  containers.forEach(updateIndicators);
}

export function setupResizeListener() {
  window.addEventListener('resize', handleResize, { passive: true });
}