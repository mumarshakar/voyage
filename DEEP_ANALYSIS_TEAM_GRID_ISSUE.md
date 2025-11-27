# DEEP ANALYSIS: Why Team Cards Don't Show 4 Per Row on Desktop

## 🔍 **COMPREHENSIVE ISSUE BREAKDOWN**

### **ISSUE 1: Bootstrap Container Max-Width Constraint**

**Location:** Line 182 - `<div class="container py-5">`

**Problem:**
- Bootstrap 5's `.container` class has **strict max-width breakpoints**:
  - `sm`: 540px
  - `md`: 720px  
  - `lg`: 960px
  - `xl`: 1140px
  - `xxl`: 1320px

**Impact:**
- Even if grid is set to 4 columns, if the container max-width is too narrow, cards will wrap
- Example: At `xl` breakpoint (1140px), with 24px gaps (3 gaps × 24px = 72px), available width = 1068px
- Each card gets: 1068px ÷ 4 = **267px per card**
- This might be too narrow, causing visual issues or wrapping

**Evidence:**
- Code uses Bootstrap container but doesn't override its max-width
- No `container-fluid` or custom width override

---

### **ISSUE 2: Grid Template Columns Applied at Wrong Level**

**Location:** Lines 138-140

**Current Code:**
```css
#shopify-section-{{ section.id }} .team-grid {
    grid-template-columns: repeat({{ desktop_columns_int }}, minmax(0, 1fr));
}
```

**Problem:**
- Grid columns ARE being set correctly
- BUT the container's max-width constraint limits how wide the grid can be
- Grid will respect container width, not viewport width

**Calculation Example:**
- If desktop_columns_int = 4
- Grid tries: `repeat(4, minmax(0, 1fr))`
- This SHOULD create 4 equal columns
- BUT if container is max 1140px wide, and has padding, actual grid width ≈ 1080px
- With 24px gaps between 4 items (3 gaps), net width = 1080px - 72px = 1008px
- Each column = 252px

**This should still work**, but might look cramped.

---

### **ISSUE 3: CSS Load Order & Specificity**

**Location:** Lines 67-180 - CSS inside `{% stylesheet %}` tag

**Problem:**
- CSS is in Shopify's `{% stylesheet %}` block
- This gets processed and might load AFTER Bootstrap CSS
- However, specificity `#shopify-section-{{ section.id }} .team-grid` is HIGH, so should win

**Potential Issue:**
- If Bootstrap has more specific selectors, they might override
- Need to verify CSS actually applies

---

### **ISSUE 4: Display: None on Wrapper Breaking Grid Layout**

**Location:** Lines 143-145

**Current Code:**
```css
#shopify-section-{{ section.id }} .team-grid-item:nth-child(n + {{ desktop_hide_start }}) .team-item-wrapper {
    display: none;
}
```

**Problem:**
- When wrapper has `display: none`, the grid item still exists
- Grid items with `display: none` content **still take up grid space**
- BUT wait - we're hiding the WRAPPER, not the grid-item
- `.team-grid-item` itself is NOT hidden, so it SHOULD still participate in grid

**Actually, this should be OK** - grid items exist, wrappers are hidden.

---

### **ISSUE 5: Missing Media Query for Desktop**

**Location:** Lines 137-145

**Problem:**
- Desktop grid columns are set WITHOUT a media query
- They apply at ALL screen sizes by default
- Then tablet media query (`@media (max-width: 1024px)`) overrides at smaller screens
- This is **backwards** - should use `min-width` for desktop

**Current Logic:**
```
Default (all sizes): 4 columns
Max-width 1024px: 3 columns  ← This overrides on tablets
Max-width 600px: 1 column    ← This overrides on mobile
```

**This should work**, but non-optimal approach.

---

### **ISSUE 6: No Explicit Desktop Media Query**

**Problem:**
- Desktop styles apply by default (no min-width)
- Tablet styles override at `max-width: 1024px`
- If screen is 1025px+, desktop rules apply
- If screen is ≤ 1024px, tablet rules apply
- If screen is ≤ 600px, mobile rules apply

**BUT:**
- Bootstrap container max-width at 1200px viewport = 1140px
- So desktop grid gets limited to 1140px max width
- Cards might look cramped

---

### **ISSUE 7: Height Constraint Causing Layout Issues**

**Location:** Line 183 - `style="height:100vh;"`

**Problem:**
- Fixed viewport height can cause overflow issues
- If content is taller than viewport, it gets cut off
- If content is shorter, creates unnecessary space
- Doesn't directly affect horizontal layout, but might cause visual confusion

---

## 🎯 **ROOT CAUSE IDENTIFICATION**

After deep analysis, the **PRIMARY ISSUES** are:

### **1. Bootstrap Container Width Limitation (MOST LIKELY)**
- Container max-width of 1140px (at xl breakpoint) might be too narrow
- With padding and gaps, available space for 4 cards = ~1000px
- Each card gets ~250px, which might look cramped or cause wrapping

### **2. Missing Explicit Desktop Breakpoint (SECONDARY)**
- No `@media (min-width: 1025px)` query for desktop
- Desktop styles apply by default, but might conflict with Bootstrap's responsive breakpoints

### **3. Grid Items Not Constrained (POTENTIAL)**
- No `max-width` or `min-width` on `.team-grid-item`
- Cards might be trying to grow beyond grid constraints

---

## ✅ **SOLUTIONS NEEDED**

### **Solution 1: Override Container Max-Width**
Add CSS to allow container to be wider:
```css
#shopify-section-{{ section.id }} .container {
    max-width: 100% !important;
    padding-left: 24px;
    padding-right: 24px;
}
```

### **Solution 2: Add Explicit Desktop Media Query**
Use `min-width` query for desktop:
```css
@media (min-width: 1025px) {
    #shopify-section-{{ section.id }} .team-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }
}
```

### **Solution 3: Constrain Grid Items**
Ensure items don't overflow:
```css
.team-grid-item {
    min-width: 0;
    max-width: 100%;
}
```

### **Solution 4: Remove Fixed Height**
Change to `min-height`:
```css
style="min-height: 100vh;"
```

### **Solution 5: Increase Container Width or Use container-fluid**
Either:
- Override container to be wider
- Or use `container-fluid` for full width
- Or create custom container class

---

## 🔬 **VERIFICATION CHECKLIST**

To confirm which issue is the problem:

1. **Check computed CSS:**
   - Inspect `.team-grid` element
   - Verify `grid-template-columns` is `repeat(4, 1fr)` (or 4 values)
   - Check container `max-width` value

2. **Check actual widths:**
   - Measure container width
   - Measure grid width  
   - Measure each card width
   - Calculate: (container width - padding - gaps) ÷ 4

3. **Check CSS specificity:**
   - Verify our CSS rules are not overridden
   - Check if Bootstrap has conflicting rules

4. **Check responsive breakpoints:**
   - Verify desktop query applies at > 1024px
   - Check if tablet/mobile queries are interfering

---

## 📊 **EXPECTED vs ACTUAL BEHAVIOR**

**Expected:**
- Desktop (> 1024px): 4 equal-width cards per row
- Tablet (601-1024px): 3 cards per row
- Mobile (≤ 600px): 1 card per row

**Actual (based on issue):**
- Desktop: Not showing 4 cards per row (likely showing fewer or wrapping)
- Mobile: Works correctly (1 per row)
- Tablet: Unknown

---

## 🎯 **MOST LIKELY ROOT CAUSE**

Based on analysis, the **most likely issue** is:

**Bootstrap Container Max-Width + Gap Calculations = Cards Too Narrow or Wrapping**

The container constrains the grid, and with gaps, there might not be enough space for 4 cards to display comfortably, causing them to wrap or appear incorrectly.

**Secondary issue:** No explicit desktop media query means desktop styles might not apply correctly at all breakpoints.

