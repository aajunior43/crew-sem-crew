# Input Component

Comprehensive input component styles for the Agentes IMG² interface modernization.

## Features

- **Multiple Input Types**: text, password, textarea, search
- **Floating Labels**: Modern floating label implementation (Requirement 10.1)
- **Visual States**: default, focus, error, success, disabled (Requirements 10.2, 10.3)
- **Character Count**: Built-in character counter for textareas (Requirement 10.4)
- **Icon Support**: Left/right icons and action buttons
- **Input Addons**: Prefix/suffix text support
- **Responsive**: Mobile-optimized with proper touch targets
- **Accessible**: WCAG AA compliant with keyboard navigation
- **Theme Support**: Light and dark theme variants

## Usage

### Basic Input

```html
<div class="input-group">
  <label class="input-group__label" for="username">Username</label>
  <input type="text" id="username" class="input" placeholder="Enter username" />
</div>
```

### Floating Label Input

```html
<div class="input-group input-group--floating">
  <input type="text" id="email" class="input" placeholder=" " />
  <label class="input-group__label" for="email">Email Address</label>
</div>
```

### Input with Error State

```html
<div class="input-group">
  <label class="input-group__label" for="password">Password</label>
  <input type="password" id="password" class="input input--error" />
  <span class="input-group__error">Password must be at least 8 characters</span>
</div>
```

### Input with Icon

```html
<div class="input-group">
  <label class="input-group__label" for="search">Search</label>
  <div class="input-wrapper input-wrapper--icon-left">
    <span class="input-wrapper__icon-left">🔍</span>
    <input type="text" id="search" class="input" placeholder="Search..." />
  </div>
</div>
```

### Password Input with Toggle

```html
<div class="input-group">
  <label class="input-group__label" for="password">Password</label>
  <div class="input-wrapper input-wrapper--icon-button">
    <input type="password" id="password" class="input" />
    <button type="button" class="input-wrapper__icon-button" aria-label="Toggle password visibility">
      👁️
    </button>
  </div>
</div>
```

### Textarea with Character Count

```html
<div class="input-group">
  <label class="input-group__label" for="description">Description</label>
  <textarea id="description" class="input" maxlength="200"></textarea>
  <span class="input-group__count">0 / 200</span>
</div>
```

### Input with Addon

```html
<div class="input-group">
  <label class="input-group__label" for="website">Website</label>
  <div class="input-addon-group">
    <span class="input-addon input-addon--prefix">https://</span>
    <input type="text" id="website" class="input" placeholder="example.com" />
  </div>
</div>
```

## CSS Classes

### Input Group
- `.input-group` - Container for input and related elements
- `.input-group--floating` - Enables floating label behavior

### Input
- `.input` - Base input class (required)
- `.input--sm` - Small size variant
- `.input--lg` - Large size variant
- `.input--error` - Error state
- `.input--success` - Success state

### Labels
- `.input-group__label` - Input label
- `.input-group__label--required` - Adds required asterisk

### Messages
- `.input-group__help` - Help text
- `.input-group__error` - Error message
- `.input-group__success` - Success message
- `.input-group__count` - Character counter
- `.input-group__count--warning` - Warning state for counter
- `.input-group__count--error` - Error state for counter

### Input Wrapper
- `.input-wrapper` - Container for input with icons
- `.input-wrapper--icon-left` - Input with left icon
- `.input-wrapper--icon-right` - Input with right icon
- `.input-wrapper--icon-button` - Input with action button
- `.input-wrapper__icon-left` - Left icon element
- `.input-wrapper__icon-right` - Right icon element
- `.input-wrapper__icon-button` - Icon button element

### Input Addons
- `.input-addon-group` - Container for input with addons
- `.input-addon` - Addon element
- `.input-addon--prefix` - Prefix addon
- `.input-addon--suffix` - Suffix addon

## States

### Focus
Inputs automatically show focus state with border color change and shadow (Requirement 10.2).

### Error
Add `.input--error` class and include `.input-group__error` message (Requirement 10.3).

### Success
Add `.input--success` class for success state.

### Disabled
Use the `disabled` attribute or `aria-disabled="true"`.

## Floating Labels

Floating labels automatically animate when:
- Input receives focus
- Input has content (`:not(:placeholder-shown)`)
- Input has `.has-value` class

**Important**: For floating labels to work, the input must have `placeholder=" "` (single space).

## Character Counter

For textareas with character limits:

1. Add `maxlength` attribute to textarea
2. Add `.input-group__count` element
3. Update counter text with JavaScript
4. Add `.input-group__count--warning` when approaching limit
5. Add `.input-group__count--error` when at limit

## Accessibility

- All inputs should have associated labels
- Use `aria-describedby` to link help text and error messages
- Error messages should be announced to screen readers
- Icon buttons must have `aria-label`
- Minimum touch target size of 44x44px on mobile
- Minimum font size of 16px on mobile to prevent zoom

## Requirements Validation

- ✅ **10.1**: Floating labels implemented
- ✅ **10.2**: Focus state with border color change and shadow
- ✅ **10.3**: Error state with inline error messages
- ✅ **10.4**: Character count for textareas

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 with graceful degradation
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Password inputs use monospace font for better character visibility
- Search inputs include built-in search icon
- All transitions respect `prefers-reduced-motion`
- Dark theme automatically adjusts colors
- Print styles remove shadows and simplify borders
