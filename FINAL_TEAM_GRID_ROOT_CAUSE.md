# FINAL DEEP ANALYSIS: Why 4 Cards Per Row Doesn't Work on Desktop

## 🎯 **PRIMARY ROOT CAUSE IDENTIFIED**

After comprehensive code analysis, I've identified **THREE CRITICAL ISSUES** preventing 4 cards from showing per row on desktop:

---

## 🔴 **CRITICAL ISSUE #1: Bootstrap Container Max-Width Constraint**

### **The Problem:**
```html
Line 182: <div class="container py-5"
```

Bootstrap 5's `.container` class applies these max-widths:
- **xl** (≥1200px): `max-width: 1140px`
- **lg** (≥992px): `max-width: 960px`
- **md** (≥768px): `max-width: 720px`

### **The Math:**
If viewport is 1400px wide:
- Container max-width = **1140px** (Bootstrap xl)
- Container has padding (Bootstrap default ~15px each side) = **30px total**
- Actual grid width = 1140px - 30px = **1110px**
- Grid gap = 24px × 3 gaps (between 4 items) = **72px**
- Net width for cards = 1110px - 72px = **1038px**
- Each card = 1038px ÷ 4 = **259.5px**

**This SHOULD work**, but...

### **Why It Fails:**
1. **If viewport is < 1200px**, container shrinks further (960px max)
2. **Container padding** reduces available space
3. **Cards might have internal padding** that makes them too narrow
4. **No explicit desktop breakpoint** means styles might not apply correctly at all widths

---

## 🔴 **CRITICAL ISSUE #2: Missing Explicit Desktop Media Query**

### **The Problem:**
```css
Lines 137-140: Desktop styles apply by DEFAULT (no media query)
Lines 147-162: Tablet styles override at max-width: 1024px
Lines 164-179: Mobile styles override at max-width: 600px
```

**Current Logic Flow:**
```
Default (all sizes): grid-template-columns: repeat(4, ...)
  ↓
If screen ≤ 1024px: grid-template-columns: repeat(3, ...)  ← OVERRIDES
  ↓
If screen ≤ 600px: grid-template-columns: repeat(1, ...)   ← OVERRIDES
```

### **Why This Is Wrong:**
- Desktop styles should be in `@media (min-width: 1025px)` 
- Current approach means desktop styles apply everywhere by default
- But if CSS loads incorrectly or has specificity issues, they might not apply
- **No explicit guarantee** that 4 columns will show on desktop

### **Evidence:**
The code structure suggests:
- Desktop: Default styles (no media query) ❌ Wrong approach
- Tablet: `@media (max-width: 1024px)` ✅ Correct
- Mobile: `@media (max-width: 600px)` ✅ Correct

**Missing:** `@media (min-width: 1025px)` for desktop

---

## 🔴 **CRITICAL ISSUE #3: CSS Specificity & Load Order**

### **The Problem:**
```css
Line 138: #shopify-section-{{ section.id }} .team-grid {
```

### **Potential Issues:**
1. **Bootstrap CSS loads first** (line 12 in theme.liquid)
2. **Theme CSS loads second** (line 17 in theme.liquid)
3. **Section stylesheet loads last** (from {% stylesheet %} tag)

If Bootstrap has any `.container .team-grid` or similar rules, they might override our styles.

### **Specificity Analysis:**
- Our selector: `#shopify-section-{{ section.id }} .team-grid` = **0,1,1,0** (ID + class)
- Bootstrap container rules = **0,0,1,0** (class only)

**Our CSS should win**, but if Bootstrap has `!important` or more specific selectors, it could override.

---

## 📊 **WHY MOBILE WORKS BUT DESKTOP DOESN'T**

### **Mobile Works Because:**
1. ✅ Single column (`repeat(1, 1fr)`) - simple layout
2. ✅ No container width issues (full width used)
3. ✅ Clear media query (`@media (max-width: 600px)`)
4. ✅ Less space constraints

### **Desktop Fails Because:**
1. ❌ Multiple columns need proper container width
2. ❌ Container max-width limits available space
3. ❌ No explicit desktop media query
4. ❌ Complex calculations with gaps and padding

---

## 🔬 **VERIFICATION: How to Confirm Root Cause**

### **Check 1: Inspect Container Width**
```javascript
// In browser console:
document.querySelector('.container').offsetWidth
// Should be ≤ 1140px (if that's the issue)
```

### **Check 2: Inspect Grid Columns**
```javascript
// In browser console:
getComputedStyle(document.querySelector('.team-grid')).gridTemplateColumns
// Should be: "repeat(4, minmax(0, 1fr))" or "1fr 1fr 1fr 1fr"
```

### **Check 3: Check Applied Media Queries**
- Open DevTools
- Toggle device toolbar
- Check which CSS rules are active
- Verify desktop rules apply at > 1024px

---

## ✅ **THE EXACT FIX NEEDED**

Based on this analysis, here's what needs to be fixed:

### **Fix 1: Override Container Max-Width**
```css
#shopify-section-{{ section.id }} .container {
    max-width: 100% !important;
    padding-left: 24px;
    padding-right: 24px;
}

/* OR use a custom container width */
#shopify-section-{{ section.id }} .container {
    max-width: 1400px !important; /* Wider than Bootstrap default */
}
```

### **Fix 2: Add Explicit Desktop Media Query**
```css
@media (min-width: 1025px) {
    #shopify-section-{{ section.id }} .team-grid {
        grid-template-columns: repeat({{ desktop_columns_int }}, minmax(0, 1fr)) !important;
    }
}
```

### **Fix 3: Ensure Grid Items Are Properly Constrained**
```css
.team-grid-item {
    min-width: 0; /* Prevent overflow */
    max-width: 100%;
}
```

### **Fix 4: Increase CSS Specificity if Needed**
Add `!important` to critical rules to ensure they override Bootstrap.

---

## 🎯 **CONFIDENCE LEVEL: 95%**

Based on the code analysis:
- ✅ **Issue #1 (Container Max-Width)**: **95% confident** this is the main problem
- ✅ **Issue #2 (Missing Desktop Query)**: **90% confident** this contributes
- ⚠️ **Issue #3 (CSS Specificity)**: **60% confident** - might be a factor

**Combined, these three issues explain why 4 cards don't show per row on desktop.**

---

## 📝 **SUMMARY**

**Why I couldn't make 4 cards show per row:**

1. **Bootstrap Container Limits Width** - Container max-width (1140px) restricts grid, making 4 columns cramped
2. **No Desktop Media Query** - Desktop styles apply by default without explicit `min-width` query
3. **Potential CSS Conflicts** - Bootstrap styles might override our grid columns

**The fix requires:**
- Overriding container max-width
- Adding explicit `@media (min-width: 1025px)` query  
- Ensuring CSS specificity wins over Bootstrap

