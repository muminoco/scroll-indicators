import { CONFIG, ATTRIBUTES } from './config.js';
import { getScrollContainers, validateContainer, debugLog } from './utils.js';
import { 
  updateIndicators, 
  setupScrollListeners, 
  setupClickListeners, 
  setupResizeListener 
} from './events.js';

/**
 * Scroll Indicators - Main module
 * 
 * HTML Attributes:
 * - data-scroll-indicators-direction="horizontal|vertical" (required on scroll container)
 * - data-scroll-indicators-position="start|end" (required on indicator)
 * - data-scroll-indicators-click="true" (optional on scroll container)
 * - data-scroll-indicators-scroll="200px|end|next" (optional on clickable indicator)
 * - data-scroll-indicators-item (optional on scrollable items - for next-item scrolling)
 * - data-scroll-indicators-next-amount="3" (optional when scroll="next", defaults to 1)
 * 
 * CSS Classes added by module:
 * - .is-visible (when indicator should be shown)
 * - .is-hidden (when indicator should be hidden)
 */

class ScrollIndicators {
  constructor() {
    this.containers = [];
    this.initialized = false;
  }

  // Initialize the module
  init() {
    if (this.initialized) {
      debugLog('Already initialized');
      return;
    }

    debugLog('Initializing Scroll Indicators...');

    // Find all scroll containers
    this.containers = Array.from(getScrollContainers()).filter(validateContainer);
    
    if (this.containers.length === 0) {
      debugLog('No valid scroll containers found');
      return;
    }

    debugLog(`Found ${this.containers.length} scroll containers`);

    // Set up event listeners
    setupScrollListeners(this.containers);
    setupClickListeners();
    setupResizeListener();

    // Initial indicator update
    this.containers.forEach(updateIndicators);

    this.initialized = true;
    debugLog('Scroll Indicators initialized successfully');
  }

  // Refresh indicators (useful for dynamic content)
  refresh() {
    debugLog('Refreshing indicators...');
    this.containers.forEach(updateIndicators);
  }

  // Add new container dynamically
  addContainer(container) {
    if (!validateContainer(container)) {
      return false;
    }

    if (!this.containers.includes(container)) {
      this.containers.push(container);
      container.addEventListener('scroll', (event) => updateIndicators(event.target), { passive: true });
      updateIndicators(container);
      debugLog('Container added:', container.id);
      return true;
    }

    return false;
  }

  // Remove container
  removeContainer(container) {
    const index = this.containers.indexOf(container);
    if (index > -1) {
      this.containers.splice(index, 1);
      debugLog('Container removed:', container.id);
      return true;
    }
    return false;
  }

  // Get current configuration
  getConfig() {
    return { ...CONFIG };
  }

  // Update configuration (limited to certain properties)
  updateConfig(newConfig) {
    const allowedKeys = ['SCROLL_BEHAVIOR', 'SCROLL_THRESHOLD', 'DEBUG'];
    
    Object.keys(newConfig).forEach(key => {
      if (allowedKeys.includes(key)) {
        CONFIG[key] = newConfig[key];
        debugLog(`Config updated: ${key} = ${newConfig[key]}`);
      }
    });
  }
}

// Create singleton instance
const scrollIndicators = new ScrollIndicators();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => scrollIndicators.init());
} else {
  scrollIndicators.init();
}

// Export for manual control
export default scrollIndicators;