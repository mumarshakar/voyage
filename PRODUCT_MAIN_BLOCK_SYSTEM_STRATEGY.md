# Product Main Section - Block System Implementation Strategy

## Analysis of Provided Code

### Key Features Identified:

1. **Structured Data (SEO)**
   ```liquid
   <script type="application/ld+json">
     {{ closest.product | structured_data }}
   </script>
   ```

2. **Content Blocks System**
   - `{% content_for 'block' %}` - Defines specific named block slots
   - `{% content_for 'blocks' %}` - Allows additional blocks to be added
   - Blocks can be dropped in theme customizer

3. **Block Types:**
   - `_product-media-gallery` - For product images/media
   - `_product-details` - For product information (title, price, variants, buttons)
   - Additional blocks via `{% content_for 'blocks' %}`

4. **Sticky Add to Cart (Optional)**
   - Custom web component `<sticky-add-to-cart>`
   - Appears when scrolling past product
   - Shows product image, title, variant, price, and add to cart button

5. **Rendering Pattern:**
   - Uses a snippet `product-information-content` to render the layout
   - Separates logic from presentation

---

## Current State Analysis

### Current `product-main.liquid` Structure:
- **Static Layout**: Hardcoded two-column layout (images left, info right)
- **No Block System**: Cannot add/remove/reorder blocks
- **Fixed Components**: Images, variants, quantity, buttons are all hardcoded
- **No Structured Data**: Missing SEO structured data
- **No Sticky Add to Cart**: No sticky functionality

### What Needs to Change:
1. Convert static layout to block-based system
2. Create block definitions for media gallery and product details
3. Add structured data
4. Optionally add sticky add-to-cart
5. Create rendering snippet for layout organization

---

## Implementation Strategy

### Phase 1: Block System Foundation

#### 1.1 Add Structured Data
```liquid
<script type="application/ld+json">
  {{ product | structured_data }}
</script>
```

#### 1.2 Define Content Blocks
```liquid
{% capture media_gallery %}
  {%- content_for 'block',
    type: '_product-media-gallery',
    id: 'media-gallery',
    product: product
  -%}
{% endcapture %}

{% capture product_details %}
  {% content_for 'block',
    type: '_product-details',
    id: 'product-details',
    product: product
  %}
{% endcapture %}

{% capture additional_blocks %}
  {% content_for 'blocks' %}
{% endcapture %}
```

#### 1.3 Update Schema to Support Blocks
```json
{
  "blocks": [
    {
      "type": "@app"
    },
    {
      "type": "_product-media-gallery",
      "name": "Product Media Gallery",
      "limit": 1
    },
    {
      "type": "_product-details",
      "name": "Product Details",
      "limit": 1
    }
  ]
}
```

---

### Phase 2: Create Block Files

#### 2.1 Create `blocks/_product-media-gallery.liquid`
- Contains product image gallery code
- Supports thumbnails
- Image zoom functionality
- Responsive design

#### 2.2 Create `blocks/_product-details.liquid`
- Contains product information
- Title, price, vendor, SKU
- Variant selector
- Quantity selector
- Add to Cart / Buy Now buttons
- Product description (optional)

---

### Phase 3: Create Rendering Snippet

#### 3.1 Create `snippets/product-main-content.liquid`
- Accepts parameters: `media_gallery`, `product_details`, `additional_blocks`, `settings`
- Handles layout (two-column, responsive)
- Applies spacing and styling
- Renders blocks in correct order

---

### Phase 4: Optional Sticky Add to Cart

#### 4.1 Add Sticky Add to Cart Component
- Custom web component (if using modern approach)
- OR traditional JavaScript implementation
- Shows when scrolling past product
- Updates based on variant selection

#### 4.2 Add Schema Setting
```json
{
  "type": "checkbox",
  "id": "enable_sticky_add_to_cart",
  "label": "Enable Sticky Add to Cart",
  "default": false
}
```

---

## Detailed Implementation Plan

### Step 1: Update `sections/product-main.liquid`

**Structure:**
```liquid
{%- liquid
  # Settings variables
-%}

<script type="application/ld+json">
  {{ product | structured_data }}
</script>

{% capture media_gallery %}
  {%- content_for 'block',
    type: '_product-media-gallery',
    id: 'media-gallery',
    product: product
  -%}
{% endcapture %}

{% capture product_details %}
  {% content_for 'block',
    type: '_product-details',
    id: 'product-details',
    product: product
  %}
{% endcapture %}

{% capture additional_blocks %}
  {% content_for 'blocks' %}
{% endcapture %}

{% if section.settings.enable_sticky_add_to_cart %}
  {% render 'sticky-add-to-cart', product: product %}
{% endif %}

{% render 'product-main-content',
  media_gallery: media_gallery,
  product_details: product_details,
  additional_blocks: additional_blocks,
  settings: section.settings
%}
```

---

### Step 2: Create Block Files

#### `blocks/_product-media-gallery.liquid`
- Move image gallery code from current `product-main.liquid`
- Make it configurable via block settings
- Support for thumbnails toggle
- Image zoom functionality

#### `blocks/_product-details.liquid`
- Move product info code from current `product-main.liquid`
- Include variant selector
- Quantity selector
- Add to Cart / Buy Now buttons
- Make components toggleable via block settings

---

### Step 3: Create Snippet `snippets/product-main-content.liquid`

**Parameters:**
- `media_gallery` - HTML content for media gallery
- `product_details` - HTML content for product details
- `additional_blocks` - HTML content for additional blocks
- `settings` - Section settings object

**Layout Logic:**
- Two-column layout (desktop)
- Stacked layout (mobile)
- Configurable column order (swap columns option)
- Responsive spacing

---

### Step 4: Update Schema

**Add Blocks:**
```json
{
  "blocks": [
    {
      "type": "@app"
    },
    {
      "type": "_product-media-gallery",
      "name": "Product Media Gallery",
      "limit": 1,
      "settings": [
        {
          "type": "checkbox",
          "id": "show_thumbnails",
          "label": "Show Thumbnails",
          "default": true
        }
      ]
    },
    {
      "type": "_product-details",
      "name": "Product Details",
      "limit": 1,
      "settings": [
        {
          "type": "checkbox",
          "id": "show_vendor",
          "label": "Show Vendor",
          "default": false
        },
        {
          "type": "checkbox",
          "id": "show_sku",
          "label": "Show SKU",
          "default": false
        },
        {
          "type": "checkbox",
          "id": "show_quantity_selector",
          "label": "Show Quantity Selector",
          "default": true
        }
      ]
    }
  ]
}
```

**Add Layout Settings:**
```json
{
  "type": "select",
  "id": "desktop_media_position",
  "label": "Media Position",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "right", "label": "Right" }
  ],
  "default": "left"
},
{
  "type": "checkbox",
  "id": "swap_columns_mobile",
  "label": "Swap Columns on Mobile",
  "default": false
}
```

---

## File Structure After Implementation

```
sections/
  └── product-main.liquid (main section file)

blocks/
  └── _product-media-gallery.liquid (media gallery block)
  └── _product-details.liquid (product details block)

snippets/
  └── product-main-content.liquid (layout rendering)
  └── sticky-add-to-cart.liquid (optional sticky component)
```

---

## Benefits of This Approach

1. **Flexibility**: Can add/remove/reorder blocks in theme customizer
2. **Modularity**: Each block is independent and reusable
3. **Maintainability**: Easier to update individual components
4. **Extensibility**: Easy to add new block types
5. **SEO**: Structured data included
6. **User Experience**: Optional sticky add-to-cart improves UX

---

## Migration Considerations

### Current Functionality to Preserve:
- ✅ Image gallery with thumbnails
- ✅ Variant selector
- ✅ Quantity selector
- ✅ Add to Cart / Buy Now buttons
- ✅ Price display with compare at price
- ✅ Vendor and SKU display (if enabled)
- ✅ Responsive design
- ✅ JavaScript functionality (variant updates, image changes)

### New Functionality:
- ➕ Block system (add/remove/reorder)
- ➕ Structured data (SEO)
- ➕ Optional sticky add-to-cart
- ➕ Better organization

---

## Implementation Checklist

- [ ] Add structured data to `product-main.liquid`
- [ ] Create `blocks/_product-media-gallery.liquid`
- [ ] Create `blocks/_product-details.liquid`
- [ ] Create `snippets/product-main-content.liquid`
- [ ] Update `sections/product-main.liquid` to use blocks
- [ ] Update schema to include blocks
- [ ] Add layout settings (media position, swap columns)
- [ ] Test block system in theme customizer
- [ ] Preserve all existing JavaScript functionality
- [ ] Test responsive design
- [ ] (Optional) Add sticky add-to-cart component
- [ ] Test on actual product pages

---

## Questions to Confirm

1. **Sticky Add to Cart**: Do you want this feature, or skip it for now?
2. **Block Order**: Should blocks be reorderable, or fixed order?
3. **Additional Blocks**: Should users be able to add custom blocks (like text, images) below product details?
4. **Backward Compatibility**: Do you need to maintain exact same styling, or can we improve it?

---

## Next Steps

1. Review this strategy
2. Confirm requirements
3. Approve implementation approach
4. Begin implementation phase by phase

---

**Ready for Review and Confirmation**

