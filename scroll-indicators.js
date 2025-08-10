import { CONFIG, ATTRIBUTES } from './config.js';
import { log, findScrollContainers, findScrollableElement, findIndicators, findClickTargets, validateDirection } from './utils.js';
import { setupScrollListener, setupClickHandlers } from './events.js';

/**
 * Validate and setup a single scroll container
 */
function setupScrollContainer(container) {
  log(`Processing container`, 'log', container);
  
  // Find scrollable element
  const scrollableElement = findScrollableElement(container);
  if (!scrollableElement) {
    return false; // Error already logged in findScrollableElement
  }
  
  // Validate direction
  const direction = validateDirection(scrollableElement);
  if (!direction) {
    return false; // Error already logged in validateDirection
  }
  
  // Find indicators
  const indicators = findIndicators(container);
  const clickTargets = findClickTargets(container);
  
  // Filter out indicators with invalid positions
  const validIndicators = Array.from(indicators).filter(indicator => {
    const position = indicator.getAttribute(ATTRIBUTES.POSITION);
    if (!position || position.trim() === '') {
      log(`Indicator missing ${ATTRIBUTES.POSITION} attribute`, 'warn', indicator);
      return false;
    }
    
    const validPositions = ['start', 'end'];
    const trimmedPosition = position.trim().toLowerCase();
    
    if (!validPositions.includes(trimmedPosition)) {
      log(`Invalid position "${position}". Must be "start" or "end"`, 'warn', indicator);
      return false;
    }
    
    return true;
  });
  
  // Filter out click targets with invalid positions
  const validClickTargets = Array.from(clickTargets).filter(clickTarget => {
    const position = clickTarget.getAttribute(ATTRIBUTES.CLICK_TARGET);
    if (!position || position.trim() === '') {
      log(`Click target missing ${ATTRIBUTES.CLICK_TARGET} attribute`, 'warn', clickTarget);
      return false;
    }
    
    const validPositions = ['start', 'end'];
    const trimmedPosition = position.trim().toLowerCase();
    
    if (!validPositions.includes(trimmedPosition)) {
      log(`Invalid click target position "${position}". Must be "start" or "end"`, 'warn', clickTarget);
      return false;
    }
    
    return true;
  });
  
  // Check if we have any valid elements to work with
  if (validIndicators.length === 0 && validClickTargets.length === 0) {
    log(`Container has no valid indicators or click targets`, 'warn', container);
    return false;
  }
  
  // Check for orphaned indicators (indicators outside any container)
  validIndicators.forEach(indicator => {
    const closestContainer = indicator.closest(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
    if (!closestContainer) {
      log(`Indicator found outside any container`, 'warn', indicator);
    } else if (closestContainer !== container) {
      log(`Indicator belongs to different container than expected`, 'warn', indicator);
    }
  });
  
  // Check for orphaned click targets (click targets outside any container)
  validClickTargets.forEach(clickTarget => {
    const closestContainer = clickTarget.closest(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
    if (!closestContainer) {
      log(`Click target found outside any container`, 'warn', clickTarget);
    } else if (closestContainer !== container) {
      log(`Click target belongs to different container than expected`, 'warn', clickTarget);
    }
  });
  
  // Setup scroll listener (now returns cleanup function)
  const cleanupScrollListener = setupScrollListener(container, scrollableElement, validIndicators, validClickTargets, direction);
  
  // Setup click handlers if enabled
  setupClickHandlers(container, scrollableElement, validClickTargets, direction);
  
  // Store cleanup function on container for potential future cleanup
  if (cleanupScrollListener) {
    container._scrollIndicatorsCleanup = cleanupScrollListener;
  }
  
  log(`Container setup complete: ${direction} scrolling, ${validIndicators.length} indicators, ${validClickTargets.length} click targets`, 'log', container);
  return true;
}

/**
 * Check for orphaned scrollable elements (outside containers)
 */
function checkForOrphanedScrollableElements() {
  const allScrollableElements = document.querySelectorAll(`[${ATTRIBUTES.DIRECTION}]`);
  
  allScrollableElements.forEach(element => {
    const container = element.closest(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
    if (!container) {
      log(`Scrollable element found outside any container`, 'warn', element);
    }
  });
}

/**
 * Check for orphaned indicators (outside containers)
 */
function checkForOrphanedIndicators() {
  const allIndicators = document.querySelectorAll(`[${ATTRIBUTES.POSITION}]`);
  
  allIndicators.forEach(indicator => {
    const container = indicator.closest(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
    if (!container) {
      log(`Indicator found outside any container`, 'warn', indicator);
    }
  });
}

/**
 * Check for orphaned click targets (outside containers)
 */
function checkForOrphanedClickTargets() {
  const allClickTargets = document.querySelectorAll(`[${ATTRIBUTES.CLICK_TARGET}]`);
  
  allClickTargets.forEach(clickTarget => {
    const container = clickTarget.closest(`[${ATTRIBUTES.CONTAINER.replace('="container"', '')}="container"]`);
    if (!container) {
      log(`Click target found outside any container`, 'warn', clickTarget);
    }
  });
}

/**
 * Initialize all scroll indicators on the page
 */
function initializeScrollIndicators() {
  log('Initializing scroll indicators...');
  
  // Find all containers
  const containers = findScrollContainers();
  
  if (containers.length === 0) {
    log('No scroll indicator containers found on page');
    return;
  }
  
  log(`Found ${containers.length} container(s)`);
  
  // Check for orphaned elements
  checkForOrphanedScrollableElements();
  checkForOrphanedIndicators();
  checkForOrphanedClickTargets();
  
  // Setup each container
  let successCount = 0;
  containers.forEach(container => {
    try {
      if (setupScrollContainer(container)) {
        successCount++;
      }
    } catch (error) {
      log(`Error setting up container: ${error.message}`, 'error', container);
    }
  });
  
  log(`Initialization complete: ${successCount}/${containers.length} containers successfully setup`);
}

/**
 * Auto-initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScrollIndicators);
} else {
  // DOM already loaded
  initializeScrollIndicators();
}

/**
 * Cleanup all scroll indicators and their listeners
 */
function cleanupScrollIndicators() {
  log('Cleaning up scroll indicators...');
  
  const containers = findScrollContainers();
  let cleanupCount = 0;
  
  containers.forEach(container => {
    if (container._scrollIndicatorsCleanup) {
      try {
        container._scrollIndicatorsCleanup();
        delete container._scrollIndicatorsCleanup;
        cleanupCount++;
      } catch (error) {
        log(`Error cleaning up container: ${error.message}`, 'error', container);
      }
    }
  });
  
  log(`Cleanup complete: ${cleanupCount} containers cleaned up`);
}

// Export for manual initialization and cleanup if needed
export { initializeScrollIndicators, cleanupScrollIndicators };