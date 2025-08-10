import { CONFIG, ATTRIBUTES } from './config.js';
import { log, isAtStart, isAtEnd, validatePosition, validateClickTargetPosition, performScroll, isElementVisible, debounce } from './utils.js';

/**
 * Update visibility of indicators and click targets based on scroll position
 */
export function updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction) {
  // Skip calculations if element is not visible
  if (!isElementVisible(scrollableElement)) {
    return false;
  }
  
  const atStart = isAtStart(scrollableElement, direction);
  const atEnd = isAtEnd(scrollableElement, direction);
  
  // Update indicator visibility
  indicators.forEach(indicator => {
    const position = validatePosition(indicator);
    if (!position) return;
    
    let shouldBeVisible = false;
    
    if (position === 'start') {
      // Start indicator visible when NOT at start (can scroll back)
      shouldBeVisible = !atStart;
    } else if (position === 'end') {
      // End indicator visible when NOT at end (can scroll forward)
      shouldBeVisible = !atEnd;
    }
    
    // Update CSS classes
    if (shouldBeVisible) {
      indicator.classList.remove(CONFIG.CSS_CLASSES.HIDDEN);
      indicator.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
    } else {
      indicator.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
      indicator.classList.add(CONFIG.CSS_CLASSES.HIDDEN);
    }
  });
  
  // Update click target visibility
  clickTargets.forEach(clickTarget => {
    const position = validateClickTargetPosition(clickTarget);
    if (!position) return;
    
    let shouldBeVisible = false;
    
    if (position === 'start') {
      // Start click target visible when NOT at start (can scroll back)
      shouldBeVisible = !atStart;
    } else if (position === 'end') {
      // End click target visible when NOT at end (can scroll forward)
      shouldBeVisible = !atEnd;
    }
    
    // Update CSS classes
    if (shouldBeVisible) {
      clickTarget.classList.remove(CONFIG.CSS_CLASSES.HIDDEN);
      clickTarget.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
    } else {
      clickTarget.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
      clickTarget.classList.add(CONFIG.CSS_CLASSES.HIDDEN);
    }
  });
  
  return true;
}

/**
 * Setup resize listener for a container
 */
export function setupResizeListener(container, scrollableElement, indicators, clickTargets, direction) {
  const handleResize = debounce(() => {
    // Only update if the element is visible
    if (isElementVisible(scrollableElement)) {
      updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction);
    }
  }, 150); // 150ms debounce
  
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Setup visibility observer for hidden elements
 */
export function setupVisibilityObserver(container, scrollableElement, indicators, clickTargets, direction) {
  if (!window.IntersectionObserver) {
    log('IntersectionObserver not supported, skipping visibility detection', 'warn');
    return null;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        // Element is now visible, update indicators
        updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction);
      }
    });
  }, {
    threshold: 0.01 // Trigger when even 1% is visible
  });
  
  observer.observe(scrollableElement);
  
  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Setup scroll event listeners with requestAnimationFrame throttling
 */
export function setupScrollListener(container, scrollableElement, indicators, clickTargets, direction) {
  let scrollUpdateRequested = false;
  
  const handleScroll = () => {
    if (!scrollUpdateRequested) {
      requestAnimationFrame(() => {
        updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction);
        scrollUpdateRequested = false;
      });
      scrollUpdateRequested = true;
    }
  };
  
  scrollableElement.addEventListener('scroll', handleScroll);
  
  // Set initial visibility - this now returns a boolean
  const initialSuccess = updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction);
  
  // Setup resize listener
  const cleanupResize = setupResizeListener(container, scrollableElement, indicators, clickTargets, direction);
  
  // If initial setup failed (element hidden), setup visibility observer
  let cleanupVisibility = null;
  if (!initialSuccess) {
    cleanupVisibility = setupVisibilityObserver(container, scrollableElement, indicators, clickTargets, direction);
  }
  
  log(`Scroll listener setup complete for ${direction} scrolling`, 'log', container);
  
  // Return cleanup function for all listeners
  return () => {
    cleanupResize();
    if (cleanupVisibility) cleanupVisibility();
  };
}

/**
 * Setup click handlers for click targets
 */
export function setupClickHandlers(container, scrollableElement, clickTargets, direction) {
  const clickEnabled = container.getAttribute(ATTRIBUTES.CLICK);
  
  if (!clickEnabled || clickEnabled.trim().toLowerCase() !== 'true') {
    return; // Click not enabled for this container
  }
  
  clickTargets.forEach(clickTarget => {
    const position = validateClickTargetPosition(clickTarget);
    if (!position) return;
    
    // Add has-click class for styling
    clickTarget.classList.add(CONFIG.CSS_CLASSES.IS_CLICK_TARGET);
    
    // Setup click handler
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      const customScrollAmount = clickTarget.getAttribute(ATTRIBUTES.CLICK_DISTANCE);
      const scrollAmount = customScrollAmount || (CONFIG.DEFAULT_SCROLL.SCROLL_TO_END ? 'end' : CONFIG.DEFAULT_SCROLL.FIXED_AMOUNT);
      
      performScroll(scrollableElement, direction, scrollAmount, position, container);
      
      log(`Click target clicked: ${position}, scroll amount: ${scrollAmount}`, 'log', clickTarget);
    };
    
    clickTarget.addEventListener('click', handleClick);
    
    // Make click target focusable and keyboard accessible
    if (!clickTarget.hasAttribute('tabindex')) {
      clickTarget.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support
    const handleKeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event);
      }
    };
    
    clickTarget.addEventListener('keydown', handleKeydown);
  });
  
  log(`Click handlers setup for ${clickTargets.length} click targets`, 'log', container);
}