# Scroll Indicators

A lightweight, robust JavaScript module for Webflow and other no-code platforms that automatically shows/hides overflow indicators based on scroll position. Perfect for horizontal scrolling galleries, carousels, and any scrollable content where users need visual feedback about available content.

## Features

- **Auto-initialization**: Works immediately when proper HTML attributes are detected
- **Flexible positioning**: Indicators and click targets can be positioned anywhere within the container
- **Smooth scrolling**: Configurable scroll behavior with multiple distance options
- **Accessibility**: Full keyboard support (Enter/Space) and proper focus management
- **Hidden container support**: Works correctly with elements in hamburger menus, modals, and initially hidden containers
- **Responsive**: Automatically handles window resize events with optimized performance
- **Visibility detection**: Smart detection of when containers become visible for accurate calculations
- **Error resilient**: Each container fails independently with helpful console warnings
- **Performance optimized**: Uses `requestAnimationFrame`, debounced resize handling, and conditional updates
- **Memory safe**: Includes cleanup functions to prevent memory leaks
- **No dependencies**: Pure vanilla JavaScript, works everywhere

## Quick Start

### 1. Include the Module

```html
<script type="module" src="path/to/scroll-indicators.js"></script>
```

### 2. Basic HTML Structure

```html
<div data-scroll-indicators="container">
  <!-- The scrollable content -->
  <div data-scroll-indicators-direction="horizontal" style="overflow-x: auto;">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <!-- More items... -->
  </div>
  
  <!-- Visual indicators -->
  <div data-scroll-indicators-position="start">←</div>
  <div data-scroll-indicators-position="end">→</div>
</div>
```

### 3. Add CSS for Visibility

```css
/* Required: Visibility states */
.is-visible {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.3s ease;
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Optional: Style clickable elements */
.is-click-target {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.is-click-target:hover {
  transform: scale(1.05);
}

.is-click-target:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

/* Recommended: Common indicator styles */
[data-scroll-indicators-position] {
  position: absolute;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-scroll-indicators-position="start"] {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

[data-scroll-indicators-position="end"] {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* For vertical scrolling */
[data-scroll-indicators-direction="vertical"] ~ [data-scroll-indicators-position="start"] {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

[data-scroll-indicators-direction="vertical"] ~ [data-scroll-indicators-position="end"] {
  bottom: 10px;
  top: auto;
  left: 50%;
  transform: translateX(-50%);
}

/* Click target button styles */
[data-scroll-indicators-click-target] {
  background: #007acc;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 122, 204, 0.3);
}

[data-scroll-indicators-click-target]:hover {
  background: #0066cc;
  box-shadow: 0 4px 12px rgba(0, 122, 204, 0.4);
}

[data-scroll-indicators-click-target]:active {
  transform: scale(0.98);
}
```

## HTML Attributes

### Required Attributes

#### On the Main Container
- `data-scroll-indicators="container"` - Identifies the container that houses the scroll element and indicators

#### On the Scrolling Element
- `data-scroll-indicators-direction="horizontal|vertical"` - Defines scroll direction

#### On Visual Indicators
- `data-scroll-indicators-position="start|end"` - Which side the indicator represents
  - `start` = left/top indicators (visible when you can scroll back)
  - `end` = right/bottom indicators (visible when you can scroll forward)

### Optional Attributes

#### Clickable Functionality
Add `data-scroll-indicators-click="true"` to the main container to enable click scrolling:

```html
<div data-scroll-indicators="container" data-scroll-indicators-click="true">
  <!-- scrollable content and indicators -->
  
  <!-- Click targets (separate from visual indicators) -->
  <button data-scroll-indicators-click-target="start">Previous</button>
  <button data-scroll-indicators-click-target="end">Next</button>
</div>
```

#### Custom Scroll Distances
Control how much to scroll when clicking targets:

```html
<!-- Scroll by specific amounts -->
<button data-scroll-indicators-click-target="start" 
        data-scroll-indicators-click-distance="200px">← 200px</button>

<button data-scroll-indicators-click-target="end" 
        data-scroll-indicators-click-distance="50%">→ 50%</button>

<!-- Scroll to absolute start/end -->
<button data-scroll-indicators-click-target="start" 
        data-scroll-indicators-click-distance="end">← Beginning</button>
```

**Supported distance values:**
- `"200px"` - Fixed pixel amount
- `"2rem"` - Root em units
- `"1.5em"` - Em units (relative to scrollable element)
- `"50%"` - Percentage of container size
- `"end"` - Scroll to very beginning/end

## CSS Classes

The module automatically adds these classes:

- `.is-visible` - Applied when indicator/click target should be shown
- `.is-hidden` - Applied when indicator/click target should be hidden  
- `.is-click-target` - Applied to clickable elements (when container has `data-scroll-indicators-click="true"`)

## Enhanced Reliability Features

The module automatically handles common edge cases:

### Hidden Container Support
Works correctly with elements inside hamburger menus, modals, tabs, or any initially hidden containers:

```html
<!-- Hamburger menu example -->
<div class="hamburger-menu" style="display: none;">
  <div data-scroll-indicators="container">
    <div data-scroll-indicators-direction="vertical" class="menu-scroll">
      <!-- Menu items -->
    </div>
    <div data-scroll-indicators-position="start">↑</div>
    <div data-scroll-indicators-position="end">↓</div>
  </div>
</div>

<script>
// When menu becomes visible, indicators work immediately
document.querySelector('.hamburger-menu').style.display = 'block';
</script>
```

### Responsive Behavior
Automatically recalculates scroll boundaries when window is resized or container dimensions change:

```css
/* Your container can be responsive */
.responsive-gallery {
  width: 100%;
  max-width: 800px;
  /* Indicators will automatically adjust */
}

@media (max-width: 768px) {
  .responsive-gallery {
    max-width: 400px;
    /* No JavaScript changes needed */
  }
}
```

### Manual Cleanup
For single-page applications or when dynamically removing containers:

```javascript
import { cleanupScrollIndicators } from './scroll-indicators.js';

// Clean up all scroll indicator listeners
cleanupScrollIndicators();

// Then safely remove containers from DOM
document.querySelector('[data-scroll-indicators="container"]').remove();
```

## Advanced Examples

### Horizontal Gallery with Separate Controls

```html
<div data-scroll-indicators="container" data-scroll-indicators-click="true">
  <!-- Scrollable gallery -->
  <div data-scroll-indicators-direction="horizontal" class="gallery">
    <img src="image1.jpg" alt="Image 1">
    <img src="image2.jpg" alt="Image 2">
    <img src="image3.jpg" alt="Image 3">
  </div>
  
  <!-- Visual indicators -->
  <div class="indicator-dots">
    <span data-scroll-indicators-position="start" class="dot">●</span>
    <span data-scroll-indicators-position="end" class="dot">●</span>
  </div>
  
  <!-- Click controls (positioned anywhere) -->
  <button data-scroll-indicators-click-target="start" 
          data-scroll-indicators-click-distance="80%"
          class="prev-btn">← Previous</button>
  <button data-scroll-indicators-click-target="end" 
          data-scroll-indicators-click-distance="80%"
          class="next-btn">Next →</button>
</div>
```

### Vertical Content with End-to-End Scrolling

```html
<div data-scroll-indicators="container" data-scroll-indicators-click="true">
  <div data-scroll-indicators-direction="vertical" class="content">
    <!-- Long vertical content -->
  </div>
  
  <button data-scroll-indicators-click-target="start" 
          data-scroll-indicators-click-distance="end">↑ Top</button>
  <button data-scroll-indicators-click-target="end" 
          data-scroll-indicators-click-distance="end">↓ Bottom</button>
</div>
```

## Configuration

Modify `config.js` to customize behavior:

```javascript
export const CONFIG = {
  // Change all attribute names
  ATTRIBUTE_PREFIX: 'data-scroll-indicators',
  
  // Customize CSS classes
  CSS_CLASSES: {
    VISIBLE: 'is-visible',
    HIDDEN: 'is-hidden',
    IS_CLICK_TARGET: 'is-click-target'
  },
  
  // Default scroll behavior
  DEFAULT_SCROLL: {
    FIXED_AMOUNT: '25%',        // Default distance when none specified
    SCROLL_TO_END: false        // true = scroll to end, false = use fixed amount
  },
  
  SCROLL_BEHAVIOR: 'smooth',    // 'smooth' | 'auto' | 'instant'
  SCROLL_THRESHOLD: 1,          // Pixels from start/end to trigger visibility
  DEBUG: true                   // Console logging
};
```

## API Reference

### Available Functions

```javascript
import { initializeScrollIndicators, cleanupScrollIndicators } from './scroll-indicators.js';

// Manual initialization (automatic by default)
initializeScrollIndicators();

// Cleanup all listeners (useful for SPAs)
cleanupScrollIndicators();
```

### Configuration Options

All configuration is done through `config.js`:

```javascript
export const CONFIG = {
  ATTRIBUTE_PREFIX: 'data-scroll-indicators',    // Customize all attribute names
  CSS_CLASSES: {
    VISIBLE: 'is-visible',                        // Class when indicator should show
    HIDDEN: 'is-hidden',                          // Class when indicator should hide
    IS_CLICK_TARGET: 'is-click-target'            // Class for clickable elements
  },
  DEFAULT_SCROLL: {
    FIXED_AMOUNT: '25%',                          // Default scroll distance
    SCROLL_TO_END: false                          // true = scroll to end, false = use fixed amount
  },
  SCROLL_BEHAVIOR: 'smooth',                      // 'smooth' | 'auto' | 'instant'
  SCROLL_THRESHOLD: 1,                            // Pixels from edge to trigger visibility
  DEBUG: true                                     // Console logging (disable in production)
};
```

## Browser Support

Works in all modern browsers that support:
- ES6 Modules
- `Element.scrollTo()` with options
- `Element.closest()`
- `requestAnimationFrame()`
- `IntersectionObserver` (optional, graceful fallback for hidden container support)

## File Structure

```
/scroll-indicators/
├── config.js           # Configuration and constants
├── utils.js            # Helper functions and validation
├── events.js           # Event handling and scroll logic
└── scroll-indicators.js # Main module and initialization
```

## Troubleshooting

### Indicators Not Appearing
- Check that container has `data-scroll-indicators="container"`
- Verify scrollable element has `data-scroll-indicators-direction`
- Ensure indicators have `data-scroll-indicators-position="start|end"`
- Check browser console for validation warnings
- **For hidden containers**: Indicators will appear automatically when container becomes visible

### Indicators Not Updating After Resize
- The module automatically handles resize events with a 150ms debounce
- If issues persist, check if container is visible during resize
- **For manual control**: Call `cleanupScrollIndicators()` then `initializeScrollIndicators()`

### Click Not Working
- Add `data-scroll-indicators-click="true"` to container
- Use `data-scroll-indicators-click-target` (not `position`) for clickable elements
- Verify click targets are inside the container

### Hidden Menu/Modal Issues
- Module automatically detects when elements become visible
- No additional setup needed for hamburger menus, modals, or tabs
- Uses `IntersectionObserver` when available (graceful fallback in older browsers)

### Scroll Not Smooth
- Check `SCROLL_BEHAVIOR` in config.js
- Ensure browser supports smooth scrolling
- Try `behavior: 'auto'` for instant scrolling

### Performance Issues
- Module uses `requestAnimationFrame` for optimal performance
- Resize events are debounced to 150ms for efficiency
- Visibility checks prevent unnecessary calculations on hidden elements
- Each container operates independently
- Use `cleanupScrollIndicators()` when removing containers in SPAs
- Disable `DEBUG` mode in production

### Memory Leaks in Single Page Apps
- Call `cleanupScrollIndicators()` before navigating away from pages with scroll indicators
- Each container stores a cleanup function that removes all its listeners
- Module is designed to be memory-safe when properly cleaned up

## License

MIT License - feel free to use in commercial projects.
