# Scroll Indicators

A lightweight JavaScript module for Webflow and other no-code platforms that automatically shows/hides overflow indicators based on scroll position. Perfect for horizontal scrolling galleries, carousels, and any scrollable content where users need visual feedback about available content.

## Features

- **Auto-initialization**: Works immediately when proper HTML attributes are detected
- **Flexible positioning**: Indicators and click targets can be positioned anywhere within the container
- **Smooth scrolling**: Configurable scroll behavior with multiple distance options
- **Accessibility**: Full keyboard support (Enter/Space) and proper focus management
- **Error resilient**: Each container fails independently with helpful console warnings
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
.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Optional: Style clickable elements */
.is-click-target {
  cursor: pointer;
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

## Browser Support

Works in all modern browsers that support:
- ES6 Modules
- `Element.scrollTo()` with options
- `Element.closest()`
- `requestAnimationFrame()`

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

### Click Not Working
- Add `data-scroll-indicators-click="true"` to container
- Use `data-scroll-indicators-click-target` (not `position`) for clickable elements
- Verify click targets are inside the container

### Scroll Not Smooth
- Check `SCROLL_BEHAVIOR` in config.js
- Ensure browser supports smooth scrolling
- Try `behavior: 'auto'` for instant scrolling

### Performance Issues
- Module uses `requestAnimationFrame` for optimal performance
- Each container operates independently
- Disable `DEBUG` mode in production

## License

MIT License - feel free to use in commercial projects.
