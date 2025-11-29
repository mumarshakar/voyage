# Mobile Menu Implementation Guide

## Step-by-Step Guide to Implement New Slide-Out Menu

This guide will walk you through implementing the new mobile menu strategy in your Shopify theme.

---

## Step 1: Understand the Current Structure

**Current File:** `snippets/header-content.liquid`

**Current Implementation:**
- Uses Bootstrap's collapse component
- Menu expands inline below header
- Hamburger button toggles Bootstrap collapse

**What We're Changing:**
- Replace Bootstrap collapse with custom slide-out overlay
- Add new overlay structure outside navbar
- Add custom JavaScript for menu control
- Update CSS for smooth animations

---

## Step 2: Update the HTML Structure

### Location: `snippets/header-content.liquid`

**Find this section (around line 234-317):**
```liquid
{% if show_mobile_menu %}
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" ...>
  <!-- hamburger icon -->
</button>
{% endif %}
<div class="collapse navbar-collapse" id="navbarNav">
  <!-- menu items -->
</div>
```

**Replace with:**
```liquid
{% if show_mobile_menu %}
<button class="mobile-menu-toggle" type="button" id="mobileMenuToggle" aria-label="Toggle menu">
  <span class="hamburger-icon">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </span>
</button>
{% endif %}

<!-- Desktop menu (unchanged) -->
<div class="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
  <!-- existing menu code stays here for desktop -->
</div>

<!-- NEW: Mobile Menu Overlay (add AFTER closing </nav> tag) -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay">
  <div class="mobile-menu-backdrop" id="mobileMenuBackdrop"></div>
  <div class="mobile-menu-panel" id="mobileMenuPanel">
    <!-- Menu Header -->
    <div class="mobile-menu-header">
      <a class="mobile-menu-logo" href="{{ routes.root_url }}">
        {% if logo_image != blank %}
          <img src="{{ logo_image | image_url: width: logo_width }}" 
               alt="{{ logo_text }}"
               style="max-height: {{ logo_max_height }}px;">
        {% elsif two_line_logo %}
          <div class="logo-two-line">
            <span class="logo-line1">{{ logo_line1 }}</span>
            <span class="logo-line2">{{ logo_line2 }}</span>
          </div>
        {% else %}
          {{ logo_text }}
        {% endif %}
      </a>
      <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Menu Navigation -->
    <nav class="mobile-menu-nav">
      <ul class="mobile-menu-list">
        {% if menu != blank %}
          {% for link in linklists[menu].links %}
            {% if link.links != blank %}
              <li class="mobile-menu-item mobile-menu-item-dropdown">
                <a class="mobile-menu-link mobile-menu-link-dropdown" 
                   href="{{ link.url }}"
                   data-dropdown-toggle="{{ link.handle }}">
                  <span class="menu-link-text">{{ link.title }}</span>
                  <svg class="menu-link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path d="M6 12l4-4-4-4"></path>
                  </svg>
                </a>
                <ul class="mobile-menu-submenu" id="submenu-{{ link.handle }}">
                  {% for childlink in link.links %}
                    <li class="mobile-menu-subitem">
                      <a class="mobile-menu-sublink" href="{{ childlink.url }}">
                        {{ childlink.title }}
                      </a>
                    </li>
                  {% endfor %}
                </ul>
              </li>
            {% else %}
              <li class="mobile-menu-item">
                <a class="mobile-menu-link {% if link.active %}active{% endif %}" 
                   href="{{ link.url }}">
                  <span class="menu-link-text">{{ link.title }}</span>
                  <svg class="menu-link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path d="M6 12l4-4-4-4"></path>
                  </svg>
                </a>
              </li>
            {% endif %}
          {% endfor %}
        {% endif %}
      </ul>
    </nav>
    
    <!-- Menu Footer with CTA -->
    <div class="mobile-menu-footer">
      {%- liquid
        assign button_href = book_now_button_url
        if button_href == blank
          assign button_href = '#'
        endif
      -%}
      <a href="{{ button_href }}" 
         class="mobile-menu-cta"
         style="background-color: {{ book_now_button_bg_color }};
                color: {{ book_now_button_text_color }} !important;">
        {{ book_now_button_text }}
      </a>
    </div>
  </div>
</div>
```

---

## Step 3: Update the Hamburger Button HTML

**Find the hamburger button (around line 234-254):**

**Replace the entire button section with:**
```liquid
{% if show_mobile_menu %}
<button class="mobile-menu-toggle" 
        type="button" 
        id="mobileMenuToggle" 
        aria-label="Toggle menu"
        style="border-color: {{ mobile_menu_border_color }};
               border-width: {{ mobile_menu_border_width }}px;
               border-radius: {{ mobile_menu_border_radius }}px;
               background-color: {% if mobile_menu_bg_transparent %}transparent{% else %}{{ mobile_menu_bg_color }}{% endif %};
               padding: {{ mobile_menu_padding }}px;
               width: {{ mobile_menu_icon_size | plus: mobile_menu_padding | plus: mobile_menu_padding }}px;
               height: {{ mobile_menu_icon_size | plus: mobile_menu_padding | plus: mobile_menu_padding }}px;">
  <span class="hamburger-icon" style="width: {{ mobile_menu_icon_size }}px; height: {{ mobile_menu_icon_size }}px;">
    <span class="hamburger-line" style="background-color: {{ mobile_menu_icon_color }}; stroke-width: {{ mobile_menu_stroke_width }}px;"></span>
    <span class="hamburger-line" style="background-color: {{ mobile_menu_icon_color }}; stroke-width: {{ mobile_menu_stroke_width }}px;"></span>
    <span class="hamburger-line" style="background-color: {{ mobile_menu_icon_color }}; stroke-width: {{ mobile_menu_stroke_width }}px;"></span>
  </span>
</button>
{% endif %}
```

---

## Step 4: Add CSS Styles

**Location: `snippets/header-content.liquid` (in the `<style>` section, around line 321)**

**Add these styles AFTER the existing mobile responsive section (after line 402):**

```css
/* ============================================
   NEW MOBILE MENU OVERLAY STYLES
   ============================================ */

/* Mobile Menu Overlay Container */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}

/* Dark Backdrop with Blur */
.mobile-menu-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Slide-Out Menu Panel */
.mobile-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 85%;
  max-width: 400px;
  height: 100%;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-menu-overlay.active .mobile-menu-panel {
  transform: translateX(0);
}

/* Menu Header */
.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.mobile-menu-logo {
  font-size: 20px;
  font-weight: 600;
  color: {{ logo_color }};
  text-decoration: none;
}

.mobile-menu-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  width: 32px;
  height: 32px;
}

.mobile-menu-close:hover {
  background-color: #f5f5f5;
}

.mobile-menu-close svg {
  width: 24px;
  height: 24px;
}

/* Menu Navigation */
.mobile-menu-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-menu-item {
  border-bottom: 1px solid #f0f0f0;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  text-decoration: none;
  color: var(--menu-link-color, #333);
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  min-height: 48px;
  font-family: var(--menu-font-family, inherit);
}

.mobile-menu-link:hover,
.mobile-menu-link:active {
  background-color: #f8f8f8;
  color: var(--menu-link-hover-color, #3577ff);
}

.mobile-menu-link.active {
  color: var(--menu-link-hover-color, #3577ff);
  font-weight: 600;
}

.menu-link-text {
  flex: 1;
}

.menu-link-arrow {
  opacity: 0.5;
  transition: transform 0.2s, opacity 0.2s;
}

.mobile-menu-link:hover .menu-link-arrow {
  transform: translateX(4px);
  opacity: 1;
}

/* Dropdown Submenu Support */
.mobile-menu-item-dropdown {
  position: relative;
}

.mobile-menu-link-dropdown {
  cursor: pointer;
}

.mobile-menu-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: #fafafa;
}

.mobile-menu-submenu.active {
  max-height: 500px;
}

.mobile-menu-subitem {
  border-bottom: 1px solid #f0f0f0;
}

.mobile-menu-sublink {
  display: block;
  padding: 14px 20px 14px 40px;
  text-decoration: none;
  color: var(--dropdown-link-color, #666);
  font-size: 15px;
  transition: background-color 0.2s, color 0.2s;
  min-height: 44px;
}

.mobile-menu-sublink:hover {
  background-color: var(--dropdown-hover-bg-color, #f8f8f8);
  color: var(--dropdown-hover-color, #3577ff);
}

/* Menu Footer with CTA */
.mobile-menu-footer {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  flex-shrink: 0;
  background: #fafafa;
}

.mobile-menu-cta {
  display: block;
  width: 100%;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.2s, transform 0.2s;
  border: none;
}

.mobile-menu-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mobile-menu-cta:active {
  transform: translateY(0);
}

/* Hamburger Icon Animation */
.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background-color: currentColor;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Animate hamburger to X when menu is open */
.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Prevent body scroll when menu is open */
body.menu-open {
  overflow: hidden;
}

/* Hide mobile menu on desktop */
@media (min-width: 992px) {
  .mobile-menu-overlay {
    display: none !important;
  }
  
  .mobile-menu-toggle {
    display: none !important;
  }
}

/* Show desktop menu on desktop */
@media (min-width: 992px) {
  .collapse.navbar-collapse.d-none.d-lg-block {
    display: flex !important;
  }
}
```

---

## Step 5: Add JavaScript

**Location: `snippets/header-content.liquid` (in the `<script>` section, around line 424)**

**Add this JavaScript AFTER the existing scroll script (after line 459):**

```javascript
// ============================================
// NEW MOBILE MENU FUNCTIONALITY
// ============================================
(function() {
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileMenuOverlay');
  const backdrop = document.getElementById('mobileMenuBackdrop');
  const panel = document.getElementById('mobileMenuPanel');
  const closeBtn = document.getElementById('mobileMenuClose');
  const body = document.body;
  
  if (!toggle || !overlay) return; // Exit if elements don't exist
  
  function openMenu() {
    overlay.classList.add('active');
    toggle.classList.add('active');
    body.classList.add('menu-open');
    // Prevent scroll on body
    document.documentElement.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    body.classList.remove('menu-open');
    // Restore scroll on body
    document.documentElement.style.overflow = '';
  }
  
  // Open menu
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });
  
  // Close menu
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Close menu when clicking a link (optional - allows navigation)
  const menuLinks = document.querySelectorAll('.mobile-menu-link:not(.mobile-menu-link-dropdown)');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Small delay to allow navigation
      setTimeout(closeMenu, 100);
    });
  });
  
  // Dropdown submenu toggle
  const dropdownToggles = document.querySelectorAll('.mobile-menu-link-dropdown');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const dropdownId = this.getAttribute('data-dropdown-toggle');
      const submenu = document.getElementById('submenu-' + dropdownId);
      
      if (submenu) {
        submenu.classList.toggle('active');
        // Rotate arrow
        const arrow = this.querySelector('.menu-link-arrow');
        if (arrow) {
          arrow.style.transform = submenu.classList.contains('active') 
            ? 'rotate(90deg)' 
            : 'rotate(0deg)';
        }
      }
    });
  });
})();
```

---

## Step 6: Update Desktop Menu Visibility

**Find the desktop menu div (around line 256):**

**Change from:**
```liquid
<div class="collapse navbar-collapse" id="navbarNav">
```

**To:**
```liquid
<div class="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
```

This hides the desktop menu on mobile (where our new overlay menu will show) and shows it on desktop.

---

## Step 7: Remove Old Mobile Menu Styles (Optional)

**In the CSS section, find and remove or comment out:**

```css
/* Remove this old mobile menu code if it exists */
@media (max-width: 991.98px) {
  .navbar-actions {
    margin-left: 0 !important;
    margin-top: 1rem;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }
  
  .book-now-button {
    margin-left: 0 !important;
    width: 100%;
    justify-content: center;
  }
  
  .navbar-nav {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
```

**Replace with:**
```css
/* Desktop menu adjustments */
@media (min-width: 992px) {
  .navbar-actions {
    margin-left: auto;
  }
}
```

---

## Step 8: Testing Checklist

After implementation, test the following:

- [ ] Hamburger button appears on mobile (< 992px width)
- [ ] Clicking hamburger opens menu (slides in from right)
- [ ] Dark backdrop appears behind menu
- [ ] Hamburger icon transforms to X when menu is open
- [ ] Clicking X button closes menu
- [ ] Clicking backdrop closes menu
- [ ] Pressing ESC key closes menu
- [ ] Menu items are clickable and navigate correctly
- [ ] Book Now button appears at bottom of menu
- [ ] Menu closes when clicking a menu link
- [ ] Body scroll is disabled when menu is open
- [ ] Desktop menu still works normally (> 992px width)
- [ ] Dropdown menus work (if you have nested items)
- [ ] Menu animations are smooth

---

## Step 9: Customization Options

### Change Menu Width
In CSS, find `.mobile-menu-panel` and change:
```css
width: 85%; /* Change this percentage */
max-width: 400px; /* Change max width */
```

### Change Animation Speed
In CSS, find transitions and change:
```css
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
/* Change 0.3s to desired duration (e.g., 0.4s for slower) */
```

### Change Backdrop Opacity
In CSS, find `.mobile-menu-backdrop` and change:
```css
background: rgba(0, 0, 0, 0.6); /* Change 0.6 to adjust opacity (0-1) */
```

### Change Menu Background Color
In CSS, find `.mobile-menu-panel` and change:
```css
background: #ffffff; /* Change to your desired color */
```

---

## Troubleshooting

### Menu doesn't open
- Check that JavaScript is loading
- Verify element IDs match (`mobileMenuToggle`, `mobileMenuOverlay`)
- Check browser console for errors

### Menu opens but doesn't slide
- Verify CSS is loaded
- Check that `.mobile-menu-overlay.active` class is being added
- Verify transform property is working

### Desktop menu hidden
- Check that `d-lg-block` class is on desktop menu
- Verify Bootstrap classes are working
- Check media query breakpoints

### Styling conflicts
- Check z-index values (menu should be 9999)
- Verify no other CSS is overriding menu styles
- Check for Bootstrap conflicts

---

## Summary

You've now implemented:
1. ✅ Slide-out sidebar menu
2. ✅ Dark backdrop with blur
3. ✅ Smooth animations
4. ✅ Close button
5. ✅ Keyboard support (ESC)
6. ✅ Body scroll lock
7. ✅ Responsive design (mobile only)
8. ✅ Dropdown submenu support

The new menu provides a modern, professional mobile experience while maintaining your desktop menu functionality!

