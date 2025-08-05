# Scroll Indicators

A lightweight, configurable module for creating scroll indicators that show/hide based on scroll position. Perfect for Webflow and other no-code platforms.

## Quick Start

1. **Include the module**:
```html
<script type="module" src="scroll-indicators.js"></script>
```

2. **Set up your scroll container with indicators**:
```html
<div data-scroll-indicators-direction="horizontal" style="overflow-x: auto;">
  <!-- Left indicator -->
  <div data-scroll-indicators-position="start">←</div>
  
  <!-- Right indicator -->
  <div data-scroll-indicators-position="end">→</div>
  
  <!-- Your scrollable content -->
  <div>Your content here...</div>
</div>
```

3. **Style the indicator visibility**:
```css
.my-indicator {
  opacity: 0;
  transition: opacity 0.3s;
}

.my-indicator.is-visible {
  opacity: 1;
}
```

That's it! The indicators will automatically show/hide based on scroll position.

## Required Attributes

### On Scroll Container:
- `data-scroll-indicators-direction="horizontal|vertical"` - Scroll direction

### On Indicator Elements:
- `data-scroll-indicators-position="start|end"` - Which side the indicator represents

## Optional Features

### Clickable Indicators

Make indicators clickable by adding `data-scroll-indicators-click="true"` to the scroll container:

```html
<div data-scroll-indicators-direction="horizontal" 
     data-scroll-indicators-click="true">
  <div data-scroll-indicators-position="start"
       data-scroll-indicators-scroll="200px">←</div>
  <!-- content -->
</div>
```

### Scroll Amounts

Control how much to scroll when clicking indicators:

- `"200px"` - Fixed pixel amount
- `"50%"` - Percentage of container size
- `"2rem"` - Any CSS unit (rem, em, vw, vh)
- `"end"` - Scroll to very beginning/end
- `"next"` - Scroll by items (see Item-based Scrolling)

### Item-based Scrolling

For galleries and carousels, scroll by specific items:

```html
<div data-scroll-indicators-direction="horizontal" 
     data-scroll-indicators-click="true">
  
  <!-- Scroll back 2 items -->
  <div data-scroll-indicators-position="start"
       data-scroll-indicators-scroll="next"
       data-scroll-indicators-next-amount="2">←</div>
  
  <!-- Scroll forward 1 item (default) -->
  <div data-scroll-indicators-position="end"
       data-scroll-indicators-scroll="next">→</div>
  
  <!-- Mark your items -->
  <div data-scroll-indicators-item>Item 1</div>
  <div data-scroll-indicators-item>Item 2</div>
  <div data-scroll-indicators-item>Item 3</div>
</div>
```

### Additional Attributes

#### On Indicator Elements:
- `data-scroll-indicators-scroll="amount"` - How much to scroll on click
- `data-scroll-indicators-next-amount="3"` - Number of items to scroll (defaults to 1)

#### On Scrollable Items:
- `data-scroll-indicators-item` - Marks element as a scrollable item

## CSS Classes

The module automatically adds these classes to indicators:

- `.is-visible` - When indicator should be shown
- `.is-hidden` - When indicator should be hidden

## Examples

### Basic Horizontal Scroll
```html
<div data-scroll-indicators-direction="horizontal" style="overflow-x: auto;">
  <div class="scroll-indicator left" 
       data-scroll-indicators-position="start">←</div>
  
  <div class="scroll-indicator right"
       data-scroll-indicators-position="end">→</div>
  
  <!-- Your scrollable content -->
</div>
```

### Clickable Vertical Scroll
```html
<div data-scroll-indicators-direction="vertical" 
     data-scroll-indicators-click="true" 
     style="overflow-y: auto;">
     
  <div class="scroll-up"
       data-scroll-indicators-position="start"
       data-scroll-indicators-scroll="100px">↑</div>
  
  <div class="scroll-down"
       data-scroll-indicators-position="end" 
       data-scroll-indicators-scroll="end">↓</div>
  
  <!-- Your scrollable content -->
</div>
```

### Item-based Scrolling (Gallery/Carousel)
```html
<div data-scroll-indicators-direction="horizontal" 
     data-scroll-indicators-click="true" 
     style="overflow-x: auto;">
     
  <!-- Left: scroll back 2 items -->
  <div class="scroll-prev"
       data-scroll-indicators-position="start"
       data-scroll-indicators-scroll="next"
       data-scroll-indicators-next-amount="2">←</div>
  
  <!-- Right: scroll forward 1 item -->
  <div class="scroll-next"
       data-scroll-indicators-position="end"
       data-scroll-indicators-scroll="next">→</div>
  
  <!-- Items to scroll through -->
  <div style="display: flex; gap: 20px;">
    <div data-scroll-indicators-item>Item 1</div>
    <div data-scroll-indicators-item>Item 2</div>
    <div data-scroll-indicators-item>Item 3</div>
    <!-- More items... -->
  </div>
</div>
```

## JavaScript API

```javascript
import scrollIndicators from './scroll-indicators.js';

// Module auto-initializes, but you can:
scrollIndicators.refresh();                    // Update all indicators
scrollIndicators.addContainer(newContainer);   // Add new container
```

## Debug Mode

To enable debug logging, set `DEBUG: true` in `config.js` or use:

```javascript
scrollIndicators.updateConfig({ DEBUG: true });
```

## Browser Support

Works in all modern browsers that support ES6 modules and smooth scrolling.

## File Structure

```
scroll-indicators/
├── config.js          # Configuration
├── utils.js           # Utility functions  
├── events.js          # Event handlers
├── scroll-indicators.js # Main module
├── example.html       # Working example
└── README.md          # This file
```