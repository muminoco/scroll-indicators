// Scroll Indicators Configuration
export const CONFIG = {
  // Attribute prefix for all data attributes
  ATTRIBUTE_PREFIX: 'data-scroll-indicators',
  
  // CSS class names
  CSS_CLASSES: {
    VISIBLE: 'is-visible',
    HIDDEN: 'is-hidden',
    IS_CLICK_TARGET: 'is-click-target'
  },
  
  // Default scroll amounts for click functionality
  DEFAULT_SCROLL: {
    FIXED_AMOUNT: '25%',
    SCROLL_TO_END: false // If true, scrolls to end/beginning, if false uses fixed amount
  },
  
  // Scroll behavior for smooth scrolling
  SCROLL_BEHAVIOR: 'smooth', // 'smooth' | 'auto' | 'instant'
  
  // Threshold for determining if we're at start/end (in pixels)
  SCROLL_THRESHOLD: 1,
  
  // Debug mode
  DEBUG: true
};

// Generate attribute names - these will update automatically if prefix changes
export const ATTRIBUTES = {
  DIRECTION: `${CONFIG.ATTRIBUTE_PREFIX}-direction`,
  POSITION: `${CONFIG.ATTRIBUTE_PREFIX}-position`,
  CLICK: `${CONFIG.ATTRIBUTE_PREFIX}-click`,
  CLICK_DISTANCE: `${CONFIG.ATTRIBUTE_PREFIX}-click-distance`,
  CLICK_TARGET: `${CONFIG.ATTRIBUTE_PREFIX}-click-target`,
  CONTAINER: `${CONFIG.ATTRIBUTE_PREFIX}="container"`
};