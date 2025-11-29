# Header Menu Colors Per-Page Strategy

## Overview
Enable different menu link colors and hover colors for the header on each page while maintaining global theme settings as fallback.

## Current Implementation Analysis

### Current Menu Color System:
1. **Global Theme Settings** (`config/settings_schema.json`):
   - `menu_link_color` - Default menu link color (default: #8B6F47)
   - `menu_link_hover_color` - Hover color (default: #FF6B35)
   
2. **CSS Application** (`layout/theme.liquid`):
   - Colors applied via CSS variables (`--menu-link-color`, `--menu-link-hover-color`)
   - Global selectors with `!important` flags ensure consistent styling

3. **Header Rendering** (`snippets/header-content.liquid`):
   - Uses `settings.menu_link_color` and `settings.menu_link_hover_color`
   - Applied globally via CSS variables in theme.liquid

## Proposed Solution: Metafields + Conditional Logic

### Approach:
Use Shopify Page Metafields to store per-page menu colors, with fallback to global theme settings.

### Why Metafields?
- ✅ Clean, structured approach
- ✅ No template duplication needed
- ✅ Easy to manage in Shopify admin
- ✅ Maintains global settings as default
- ✅ Flexible and scalable

### Implementation Flow:

#### Phase 1: Metafield Setup (Manual in Shopify Admin)
1. **Create Metafield Definitions**:
   - Namespace: `custom`
   - Key: `menu_link_color` (type: color)
   - Key: `menu_link_hover_color` (type: color)
   - Applicable to: Pages, Articles, Products (if needed)

#### Phase 2: Code Implementation

**Step 1: Update `snippets/header-content.liquid`**
- Add Liquid logic to check for page metafields
- Priority order:
  1. Current page metafield (if exists)
  2. Global theme settings (fallback)
- Create variables: `current_menu_link_color` and `current_menu_link_hover_color`

**Step 2: Update `layout/theme.liquid`**
- Modify CSS variable assignment to be dynamic
- Use section-specific CSS variables for the header section
- Apply colors with section ID specificity: `#shopify-section-header-{{ section.id }}`

**Step 3: Add Inline Styles or Dynamic CSS**
- Apply per-page colors using inline styles or a dynamic `<style>` block
- Target: `.navbar .nav-link` and `.navbar .nav-link:hover`
- Use section ID for specificity: `#shopify-section-{{ section.id }}`

#### Phase 3: Header Section Schema (Optional Enhancement)
- Add a toggle in header section: "Use Page-Specific Menu Colors"
- When enabled, checks metafields; when disabled, uses theme settings only

## Technical Implementation Details

### Liquid Logic Flow:
```liquid
{%- liquid
  # Initialize with global theme settings
  assign menu_link_color = settings.menu_link_color | default: '#8B6F47'
  assign menu_link_hover_color = settings.menu_link_hover_color | default: '#FF6B35'
  
  # Check for page-specific metafields (priority order)
  if page.metafields.custom.menu_link_color != blank
    assign menu_link_color = page.metafields.custom.menu_link_color
  endif
  
  if page.metafields.custom.menu_link_hover_color != blank
    assign menu_link_hover_color = page.metafields.custom.menu_link_hover_color
  endif
  
  # Alternative: Check template name for specific pages
  # if template.name == 'page' and page.handle == 'about'
  #   assign menu_link_color = '#FF0000'
  # endif
-%}
```

### CSS Application Method:
```liquid
<style>
  /* Section-specific menu colors */
  #shopify-section-{{ section.id }} .navbar .nav-link {
    color: {{ menu_link_color }} !important;
  }
  
  #shopify-section-{{ section.id }} .navbar .nav-link:hover {
    color: {{ menu_link_hover_color }} !important;
  }
</style>
```

## Alternative Approaches Considered

### ❌ Option 1: Template-Specific Settings
- **Issue**: Header is global, not template-specific
- **Problem**: Would require duplicating header section per template

### ❌ Option 2: JavaScript-Based Solution
- **Issue**: Not reliable, requires DOM manipulation
- **Problem**: Flash of unstyled content (FOUC)

### ✅ Option 3: Metafields (Selected)
- **Advantage**: Clean, maintainable, no code duplication
- **Flexible**: Works for pages, articles, products if needed

## User Workflow After Implementation

1. **For Global Colors**:
   - Go to: Theme Settings > Menus
   - Adjust `Menu Link Color` and `Menu Link Hover Color`

2. **For Per-Page Colors**:
   - Go to: Pages > [Select Page] > Metafields
   - Set `menu_link_color` (custom color picker)
   - Set `menu_link_hover_color` (custom color picker)
   - If not set, page uses global theme settings

## Files to Modify

1. **`snippets/header-content.liquid`**
   - Add metafield checking logic
   - Create conditional color variables

2. **`layout/theme.liquid`**
   - Modify menu color CSS to support section-specific overrides
   - Add dynamic style block for header section

3. **`sections/header.liquid`** (Optional)
   - Add schema toggle for "Enable Page-Specific Menu Colors"

## Benefits

✅ **Flexibility**: Each page can have unique menu colors  
✅ **Maintainability**: Global defaults remain in theme settings  
✅ **User-Friendly**: Easy to manage in Shopify admin  
✅ **Performance**: No JavaScript overhead  
✅ **Backward Compatible**: Existing theme settings continue to work  

## Edge Cases to Handle

1. **Homepage**: Use `template.name == 'index'` check
2. **Product Pages**: Support product metafields if needed
3. **Collection Pages**: Support collection metafields if needed
4. **Article Pages**: Support article metafields if needed
5. **Empty Metafields**: Fallback to theme settings gracefully

## Testing Checklist

- [ ] Global theme settings work as before
- [ ] Page metafields override theme settings correctly
- [ ] Empty metafields fallback to theme settings
- [ ] Hover states work on all pages
- [ ] Mobile menu colors reflect correctly
- [ ] Dropdown menu colors (if separate) are considered
- [ ] Performance: No FOUC or styling delays

## Future Enhancements

1. **Per-Template Colors**: Colors based on template type
2. **Per-Collection Colors**: Menu colors for collection pages
3. **Per-Product Colors**: Menu colors for product pages
4. **Color Presets**: Pre-defined color sets to choose from
5. **Section Schema UI**: Toggle in header section for easier control

---

## Recommendation

**Proceed with Metafields Approach** - This is the most flexible, maintainable, and Shopify-native solution for per-page customization.

