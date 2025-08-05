import { CONFIG, ATTRIBUTES } from './config.js';
import { log, isAtStart, isAtEnd, validatePosition, validateClickTargetPosition, performScroll } from './utils.js';

/**
 * Update visibility of indicators and click targets based on scroll position
 */
export function updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction) {
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
  
  // Set initial visibility
  updateIndicatorVisibility(container, scrollableElement, indicators, clickTargets, direction);
  
  log(`Scroll listener setup complete for ${direction} scrolling`, 'log', container);
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
      
      const customScrollAmount = clickTarget.getAttribute(ATTRIBUTES.SCROLL);
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