# Meet Team Section - Root Cause Analysis & Fix Strategy

## 🔴 **ROOT CAUSE: CSS Grid + Display Property Conflict**

### **The Critical Problem**

**Lines 96-102, 109-115, 123-129**: The section uses CSS Grid but applies `display: block` to grid items.

```css
.team-grid {
    display: grid;  /* Container is a grid */
}

.team-grid-item {
    display: none;  /* Hide all items */
}

.team-grid-item:nth-child(-n + X) {
    display: block;  /* Show some items as block */
}
```

### **Why This Breaks**

1. **Grid items are NOT block elements**: When you set `display: block` on a grid item, it breaks out of the grid layout flow
2. **Grid expects direct children to be grid items**: Using `display: block` makes them behave like regular block elements, losing grid positioning
3. **Result**: Items are either completely hidden or positioned incorrectly, not visible in the grid

---

## 🟡 **Secondary Issues**

### **Issue 2: Liquid Filters in CSS Context**
- **Lines 93, 100, 106, 113, 120, 127**: `| default:` filters used inside CSS
- **Problem**: If variable is empty, creates invalid CSS like `repeat(, ...)` or `:nth-child(-n + )`
- **Impact**: CSS parser might reject entire rule, hiding all items

### **Issue 3: Variable Conversion Edge Cases**
- **Lines 12-17**: String to number conversion with `| plus: 0`
- **Problem**: If setting is blank, could result in 0 or empty value
- **Impact**: `:nth-child(-n + 0)` would hide everything

### **Issue 4: Redundant CSS Rule**
- **Line 89**: Hardcoded grid-template-columns that's immediately overridden
- **Impact**: Unnecessary CSS, but doesn't break functionality

### **Issue 5: Unused Attribute**
- **Line 149**: `data-index` attribute never used
- **Impact**: Unnecessary markup

---

## ✅ **FIX STRATEGY**

### **Phase 1: Ensure Valid Variables**
- Add explicit validation for all numeric variables
- Guarantee they're never 0 or empty
- Set safe defaults in Liquid before CSS rendering

### **Phase 2: Fix Display Property (CRITICAL)**
- **Recommended**: Use `visibility: hidden/visible` instead of `display: none/block`
  - Preserves grid layout flow
  - Items remain in grid but are just hidden
  - Better performance
- **Alternative**: Remove display entirely, let grid handle layout

### **Phase 3: Remove Liquid Filters from CSS**
- Calculate all values in Liquid variables first
- Ensure valid numbers, then inject clean values into CSS
- No filters inside CSS selectors

### **Phase 4: Cleanup**
- Remove redundant hardcoded rule (line 89)
- Remove unused `data-index` attribute (line 149)

---

## 📋 **Implementation Plan**

1. ✅ Validate all numeric variables with explicit defaults
2. ✅ Replace `display: none/block` with `visibility: hidden/visible`
3. ✅ Remove all `| default:` filters from CSS selectors
4. ✅ Clean up redundant/unused code

---

## 🎯 **Expected Outcome**

After fix:
- ✅ Team member cards display correctly in grid layout
- ✅ Visibility controls work as expected (desktop/tablet/mobile)
- ✅ No CSS conflicts or invalid rules
- ✅ Clean, maintainable code

