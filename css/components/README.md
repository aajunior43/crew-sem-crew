# Button Component Documentation

## Overview

The button component provides a comprehensive set of button styles for the Agentes IMG² application. It includes multiple variants, states, sizes, and modifiers to cover all use cases in the interface modernization.

## Requirements

This component satisfies the following requirements:
- **10.5**: Modern button styles with clear primary, secondary, and tertiary variants
- **10.6**: Disabled button visual state with reduced opacity and not-allowed cursor
- **15.2**: Consistent button hierarchy based on action importance

## Usage

### Basic Button

```html
<button class="btn btn--primary">
  <span class="btn__text">Click Me</span>
</button>
```

### Button with Icon

```html
<button class="btn btn--primary">
  <span class="btn__icon">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <!-- SVG path -->
    </svg>
  </span>
  <span class="btn__text">Save</span>
</button>
```

## Variants

### Primary Button
Use for main actions (Play, Save, Execute)

```html
<button class="btn btn--primary">
  <span class="btn__text">Primary Action</span>
</button>
```

### Secondary Button
Use for supporting actions (Load, Edit, Cancel)

```html
<button class="btn btn--secondary">
  <span class="btn__text">Secondary Action</span>
</button>
```

### Tertiary Button
Use for low-emphasis actions (Cancel, Minimize)

```html
<button class="btn btn--tertiary">
  <span class="btn__text">Tertiary Action</span>
</button>
```

### Danger Button
Use for destructive actions (Delete, Remove, Clear)

```html
<button class="btn btn--danger">
  <span class="btn__text">Delete</span>
</button>
```

### Danger Outline Button
Use for less aggressive destructive actions

```html
<button class="btn btn--danger-outline">
  <span class="btn__text">Remove</span>
</button>
```

## States

### Disabled State

```html
<button class="btn btn--primary" disabled>
  <span class="btn__text">Disabled</span>
</button>
```

Or with ARIA:

```html
<button class="btn btn--primary" aria-disabled="true">
  <span class="btn__text">Disabled</span>
</button>
```

### Loading State

```html
<button class="btn btn--primary btn--loading">
  <span class="btn__text">Loading</span>
  <span class="btn__spinner">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="8" cy="8" r="6" stroke-dasharray="30" stroke-dashoffset="10"/>
    </svg>
  </span>
</button>
```

## Sizes

### Small Button

```html
<button class="btn btn--primary btn--sm">
  <span class="btn__text">Small</span>
</button>
```

### Medium Button (Default)

```html
<button class="btn btn--primary btn--md">
  <span class="btn__text">Medium</span>
</button>
```

### Large Button

```html
<button class="btn btn--primary btn--lg">
  <span class="btn__text">Large</span>
</button>
```

## Icon Buttons

Icon-only buttons for actions where space is limited.

```html
<button class="icon-btn" aria-label="Settings">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <!-- SVG path -->
  </svg>
</button>
```

### Icon Button Sizes

```html
<!-- Small -->
<button class="icon-btn icon-btn--sm" aria-label="Close">
  <svg width="16" height="16"><!-- SVG --></svg>
</button>

<!-- Medium (default) -->
<button class="icon-btn" aria-label="Edit">
  <svg width="20" height="20"><!-- SVG --></svg>
</button>

<!-- Large -->
<button class="icon-btn icon-btn--lg" aria-label="Menu">
  <svg width="24" height="24"><!-- SVG --></svg>
</button>
```

## Modifiers

### Full Width Button

```html
<button class="btn btn--primary btn--block">
  <span class="btn__text">Full Width</span>
</button>
```

## Button Groups

### Horizontal Group

```html
<div class="button-group">
  <button class="btn btn--primary">
    <span class="btn__text">Play</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Save</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Load</span>
  </button>
</div>
```

### Vertical Group

```html
<div class="button-group button-group--vertical">
  <button class="btn btn--secondary">
    <span class="btn__text">Option 1</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Option 2</span>
  </button>
</div>
```

### Attached Group

```html
<div class="button-group button-group--attached">
  <button class="btn btn--secondary">
    <span class="btn__text">Left</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Middle</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Right</span>
  </button>
</div>
```

## Accessibility

### ARIA Labels

Always provide `aria-label` for icon-only buttons:

```html
<button class="icon-btn" aria-label="Close dialog">
  <svg><!-- Close icon --></svg>
</button>
```

### Keyboard Navigation

All buttons are keyboard accessible by default. Focus indicators are visible when navigating with Tab key.

### Disabled State

Use the `disabled` attribute or `aria-disabled="true"` for disabled buttons. The component handles both cases.

## Responsive Behavior

On mobile viewports (< 768px):
- Touch targets are automatically sized to minimum 44x44px
- Button groups can stack vertically using `button-group--mobile-stack` class

```html
<div class="button-group button-group--mobile-stack">
  <button class="btn btn--primary">
    <span class="btn__text">Action 1</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Action 2</span>
  </button>
</div>
```

## Theme Support

The button component automatically adapts to light and dark themes. No additional classes needed.

## Reduced Motion

The component respects `prefers-reduced-motion` settings, disabling animations for users who prefer reduced motion.

## Best Practices

1. **Use semantic HTML**: Always use `<button>` elements for buttons, not `<div>` or `<a>`
2. **Provide text labels**: Even for icon buttons, use `aria-label` or visually hidden text
3. **Choose appropriate variants**: 
   - Primary for main actions (max 1-2 per screen)
   - Secondary for supporting actions
   - Tertiary for low-priority actions
   - Danger for destructive actions
4. **Maintain hierarchy**: Don't use multiple primary buttons in the same context
5. **Group related actions**: Use button groups for related actions
6. **Adequate spacing**: Maintain minimum 8px gap between buttons (handled by `button-group`)
7. **Loading states**: Show loading state for async operations
8. **Disabled states**: Disable buttons during processing to prevent double-clicks

## Examples

### Action Toolbar

```html
<div class="button-group">
  <button class="btn btn--primary">
    <span class="btn__icon">▶</span>
    <span class="btn__text">Play</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Save</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Load</span>
  </button>
</div>
```

### Form Actions

```html
<div class="button-group">
  <button type="submit" class="btn btn--primary">
    <span class="btn__text">Submit</span>
  </button>
  <button type="button" class="btn btn--tertiary">
    <span class="btn__text">Cancel</span>
  </button>
</div>
```

### Destructive Action Confirmation

```html
<div class="button-group">
  <button class="btn btn--danger">
    <span class="btn__icon">🗑️</span>
    <span class="btn__text">Delete Agent</span>
  </button>
  <button class="btn btn--secondary">
    <span class="btn__text">Keep Agent</span>
  </button>
</div>
```

## Demo

A comprehensive showcase of all button variants, states, and sizes is available at:
`crew-sem-crew/demos/button-showcase.html`

Open this file in a browser to see all button styles in action and test interactions.
