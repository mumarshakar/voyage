# Footer Social Media Images Implementation Strategy

## Current State Analysis

### **Current Footer:**
- ✅ Single Instagram text link
- ✅ Simple centered layout
- ✅ Minimalist design with text and underline
- ✅ Only Instagram platform supported

### **What We Need:**
- ✅ Multiple social media platforms (Instagram, Facebook, YouTube, etc.)
- ✅ Image-based icons instead of text
- ✅ Placeholder images when custom images not uploaded
- ✅ Horizontal row layout for multiple icons
- ✅ Each platform should be individually configurable

---

## Implementation Strategy

### **Phase 1: Schema Design**

#### **Option A: Blocks-Based Approach (Recommended) ⭐**

**Structure:**
- Use Shopify's `blocks` feature for social media items
- Each block = One social media platform
- Flexible: Add/remove platforms easily
- Max blocks: 10-15 social platforms

**Schema Structure:**
```json
{
  "name": "Footer",
  "blocks": [
    {
      "type": "social_media",
      "name": "Social Media",
      "settings": [
        {
          "type": "select",
          "id": "platform",
          "label": "Platform",
          "options": [
            {"value": "instagram", "label": "Instagram"},
            {"value": "facebook", "label": "Facebook"},
            {"value": "youtube", "label": "YouTube"},
            {"value": "twitter", "label": "Twitter/X"},
            {"value": "tiktok", "label": "TikTok"},
            {"value": "linkedin", "label": "LinkedIn"},
            {"value": "pinterest", "label": "Pinterest"},
            {"value": "snapchat", "label": "Snapchat"}
          ]
        },
        {
          "type": "url",
          "id": "social_url",
          "label": "Profile URL"
        },
        {
          "type": "image_picker",
          "id": "custom_icon",
          "label": "Custom Icon Image",
          "info": "Upload custom icon. If not provided, default platform icon will be used."
        }
      ]
    }
  ],
  "settings": [
    // Global footer settings (spacing, alignment, etc.)
  ]
}
```

**Pros:**
- ✅ Most flexible approach
- ✅ Easy to add/remove platforms in theme editor
- ✅ Each platform independently configurable
- ✅ Shopify-native blocks interface

**Cons:**
- ❌ Slightly more complex schema

---

#### **Option B: Individual Platform Settings**

**Structure:**
- Fixed settings for each platform
- Show/hide toggle for each
- Image picker for each platform

**Schema Structure:**
```json
{
  "settings": [
    {
      "type": "header",
      "content": "Instagram"
    },
    {
      "type": "checkbox",
      "id": "show_instagram",
      "label": "Show Instagram",
      "default": true
    },
    {
      "type": "url",
      "id": "instagram_url",
      "label": "Instagram URL"
    },
    {
      "type": "image_picker",
      "id": "instagram_icon",
      "label": "Instagram Icon"
    },
    // Repeat for Facebook, YouTube, etc.
  ]
}
```

**Pros:**
- ✅ Simple structure
- ✅ Easy to understand
- ✅ Fixed platforms list

**Cons:**
- ❌ Less flexible (requires code changes to add platforms)
- ❌ Repetitive schema code
- ❌ Harder to manage many platforms

---

### **Recommended Approach: Option A (Blocks-Based)**

---

## Phase 2: Placeholder Images Strategy

### **Placeholder Image Sources:**

#### **Option 1: SVG Data URLs (Recommended) ⭐**

**Implementation:**
- Store SVG placeholders as Liquid variables
- Generate platform-specific SVG icons inline
- No external dependencies
- Always available

**Example Structure:**
```liquid
{%- liquid
  case block.settings.platform
    when 'instagram'
      assign placeholder_svg = '<svg>...</svg>' # Instagram icon SVG
    when 'facebook'
      assign placeholder_svg = '<svg>...</svg>' # Facebook icon SVG
    # ... etc
  endcase
-%}
```

**Pros:**
- ✅ No external files needed
- ✅ Always loads (no 404 errors)
- ✅ Scalable (SVG)
- ✅ Small file size

**Cons:**
- ❌ SVG code in template (can be verbose)

---

#### **Option 2: External Placeholder Service**

**Implementation:**
- Use services like `placeholder.com` or similar
- Platform-specific URLs
- Example: `https://via.placeholder.com/50?text=IG`

**Pros:**
- ✅ Clean code
- ✅ Easy to update

**Cons:**
- ❌ External dependency
- ❌ May not have branded icons
- ❌ Requires internet connection

---

#### **Option 3: Local Assets Folder**

**Implementation:**
- Store placeholder images in `/assets/` folder
- Naming: `icon-instagram-placeholder.png`, `icon-facebook-placeholder.png`
- Reference via Liquid: `{{ 'icon-instagram-placeholder.png' | asset_url }}`

**Pros:**
- ✅ Branded icons possible
- ✅ No external dependencies
- ✅ Easy to customize

**Cons:**
- ❌ Requires asset files to be created
- ❌ Multiple files to manage

---

### **Recommended: Option 1 (SVG Data URLs) + Option 3 (Local Assets) Hybrid**

- Use SVG placeholders as primary fallback
- Allow option to upload custom assets later if needed
- Provide clean, branded SVG icons for each platform

---

## Phase 3: Layout Design

### **Current Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│    Follow us on instagram!          │
│      (centered text link)           │
│                                     │
└─────────────────────────────────────┘
```

### **New Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  [IG] [FB] [YT] [TT] [LI]          │
│   (horizontal row of icons)         │
│                                     │
└─────────────────────────────────────┘
```

### **Layout Features:**

1. **Horizontal Row:**
   - Flexbox layout: `display: flex`
   - `gap`: Configurable spacing between icons
   - `justify-content: center` (center alignment)
   - `align-items: center` (vertical centering)

2. **Icon Sizing:**
   - Configurable icon size (schema setting)
   - Responsive: Smaller on mobile, larger on desktop
   - Aspect ratio: Square icons (1:1)

3. **Spacing:**
   - Gap between icons (schema setting)
   - Padding around icon container

4. **Alignment Options:**
   - Center (default)
   - Left
   - Right
   - Space-between (if needed)

---

## Phase 4: Implementation Flow

### **Step 1: Update Schema (`sections/footer.liquid`)**

1. **Add Blocks Section:**
   ```json
   "blocks": [
     {
       "type": "social_media",
       "name": "Social Media",
       "settings": [
         {
           "type": "select",
           "id": "platform",
           "label": "Platform",
           "options": [
             {"value": "instagram", "label": "Instagram"},
             {"value": "facebook", "label": "Facebook"},
             {"value": "youtube", "label": "YouTube"},
             {"value": "twitter", "label": "Twitter/X"},
             {"value": "tiktok", "label": "TikTok"},
             {"value": "linkedin", "label": "LinkedIn"},
             {"value": "pinterest", "label": "Pinterest"}
           ],
           "default": "instagram"
         },
         {
           "type": "url",
           "id": "social_url",
           "label": "Profile URL",
           "info": "Link to your profile on this platform"
         },
         {
           "type": "image_picker",
           "id": "custom_icon",
           "label": "Custom Icon",
           "info": "Upload custom icon. Leave empty to use default platform icon."
         }
       ]
     }
   ],
   "max_blocks": 10
   ```

2. **Add Global Settings:**
   ```json
   {
     "type": "header",
     "content": "Social Media Icons"
   },
   {
     "type": "range",
     "id": "icon_size",
     "label": "Icon Size (px)",
     "min": 24,
     "max": 80,
     "step": 2,
     "default": 40,
     "unit": "px"
   },
   {
     "type": "range",
     "id": "icon_gap",
     "label": "Spacing Between Icons (px)",
     "min": 8,
     "max": 40,
     "step": 2,
     "default": 16,
     "unit": "px"
   },
   {
     "type": "select",
     "id": "icon_alignment",
     "label": "Icon Alignment",
     "options": [
       {"value": "center", "label": "Center"},
       {"value": "left", "label": "Left"},
       {"value": "right", "label": "Right"}
     ],
     "default": "center"
   },
   {
     "type": "range",
     "id": "icon_size_mobile",
     "label": "Icon Size - Mobile (px)",
     "min": 24,
     "max": 60,
     "step": 2,
     "default": 32,
     "unit": "px"
   }
   ```

---

### **Step 2: Update Footer Content (`snippets/footer-content.liquid`)**

#### **A. Liquid Logic for Icons:**

```liquid
{%- liquid
  # Get global icon settings
  assign icon_size = section.settings.icon_size | default: 40
  assign icon_gap = section.settings.icon_gap | default: 16
  assign icon_alignment = section.settings.icon_alignment | default: 'center'
  assign icon_size_mobile = section.settings.icon_size_mobile | default: 32
  
  # Count blocks
  assign social_blocks_count = section.blocks | where: 'type', 'social_media' | size
-%}
```

#### **B. Placeholder SVG Function:**

Create a snippet or inline function to generate placeholder SVGs:

```liquid
{%- liquid
  # Function to get placeholder SVG based on platform
  case block.settings.platform
    when 'instagram'
      assign placeholder_icon = 'instagram-icon.svg' # or inline SVG
    when 'facebook'
      assign placeholder_icon = 'facebook-icon.svg'
    # ... etc
  endcase
-%}
```

#### **C. Icon Rendering Logic:**

```liquid
{% if social_blocks_count > 0 %}
  <div class="social-icons-container" 
       style="display: flex;
              gap: {{ icon_gap }}px;
              justify-content: {{ icon_alignment }};
              align-items: center;
              flex-wrap: wrap;">
    
    {% for block in section.blocks %}
      {% if block.type == 'social_media' and block.settings.social_url != blank %}
        {%- liquid
          assign platform = block.settings.platform
          assign social_url = block.settings.social_url
          assign custom_icon = block.settings.custom_icon
          
          # Determine which icon to use
          if custom_icon != blank
            assign icon_image = custom_icon
            assign use_custom = true
          else
            assign use_custom = false
            # Use placeholder based on platform
          endif
        -%}
        
        <a href="{{ social_url }}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="social-icon-link"
           style="display: inline-block;
                  width: {{ icon_size }}px;
                  height: {{ icon_size }}px;
                  transition: transform 0.3s ease, opacity 0.3s ease;">
          
          {% if use_custom %}
            <img src="{{ icon_image | image_url: width: icon_size }}"
                 alt="{{ platform | capitalize }}"
                 width="{{ icon_size }}"
                 height="{{ icon_size }}"
                 loading="lazy"
                 style="width: 100%; height: 100%; object-fit: contain;">
          {% else %}
            <!-- Placeholder SVG or image based on platform -->
            {{ placeholder_svg_for_platform }}
          {% endif %}
        </a>
      {% endif %}
    {% endfor %}
  </div>
{% endif %}
```

---

### **Step 3: Placeholder Images Implementation**

#### **Option A: Inline SVG (Simple Icons)**

Create platform-specific SVG placeholders:

```liquid
{%- case block.settings.platform -%}
  {%- when 'instagram' -%}
    {%- assign placeholder_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' -%}
  
  {%- when 'facebook' -%}
    {%- assign placeholder_svg = '<svg>...</svg>' -%}
  
  {%- when 'youtube' -%}
    {%- assign placeholder_svg = '<svg>...</svg>' -%}
  
  # ... etc for other platforms
{%- endcase -%}
```

#### **Option B: Asset Files (Recommended for Branded Icons)**

1. Create placeholder images in `/assets/` folder:
   - `social-icon-instagram.png`
   - `social-icon-facebook.png`
   - `social-icon-youtube.png`
   - etc.

2. Reference in Liquid:
```liquid
{%- liquid
  assign placeholder_filename = 'social-icon-' | append: block.settings.platform | append: '.png'
  assign placeholder_url = placeholder_filename | asset_url
-%}
<img src="{{ placeholder_url }}"
     alt="{{ platform | capitalize }}"
     width="{{ icon_size }}"
     height="{{ icon_size }}"
     loading="lazy">
```

---

### **Step 4: CSS Styling**

Add responsive styles:

```css
.social-icons-container {
  display: flex;
  gap: var(--icon-gap, 16px);
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.social-icon-link {
  display: inline-block;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.social-icon-link:hover {
  transform: translateY(-3px) scale(1.1);
  opacity: 0.8;
}

.social-icon-link img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* Mobile responsive */
@media (max-width: 767px) {
  .social-icons-container {
    gap: 12px;
  }
  
  .social-icon-link {
    width: 32px;
    height: 32px;
  }
}
```

---

## Phase 5: Placeholder Image Sources

### **Recommended: Use SimpleBranded SVG Icons**

We'll create simple, recognizable SVG icons for each platform:

1. **Instagram**: Camera/square icon with gradient
2. **Facebook**: "f" letter icon
3. **YouTube**: Play button icon
4. **Twitter/X**: "X" or bird icon
5. **TikTok**: Music note icon
6. **LinkedIn**: "in" text icon
7. **Pinterest**: "P" letter icon
8. **Snapchat**: Ghost icon

**SVG Benefits:**
- Scalable without quality loss
- Small file size
- Can be styled with CSS
- Always available (no 404 errors)

---

## Implementation Checklist

### **Schema Updates:**
- [ ] Add blocks structure for social media
- [ ] Add platform select dropdown
- [ ] Add URL field for each platform
- [ ] Add image picker for custom icons
- [ ] Add global icon settings (size, gap, alignment)
- [ ] Add mobile-specific settings
- [ ] Set max_blocks limit

### **Liquid Logic:**
- [ ] Update footer-content.liquid to loop through blocks
- [ ] Implement icon selection logic (custom vs placeholder)
- [ ] Add platform-specific placeholder SVG/icons
- [ ] Handle conditional rendering (only show if URL exists)
- [ ] Add responsive icon sizing

### **Styling:**
- [ ] Create flexbox layout for icon row
- [ ] Add hover effects (scale, opacity)
- [ ] Implement responsive styles (mobile/tablet/desktop)
- [ ] Ensure proper spacing and alignment
- [ ] Add smooth transitions

### **Placeholder Assets:**
- [ ] Create SVG placeholders for each platform
- [ ] OR create PNG placeholder images in /assets/
- [ ] Test fallback when custom icons not uploaded

### **Testing:**
- [ ] Test with no blocks (should show nothing)
- [ ] Test with one platform
- [ ] Test with multiple platforms
- [ ] Test with custom icons
- [ ] Test with placeholder icons
- [ ] Test responsive behavior
- [ ] Test link functionality (opens in new tab)
- [ ] Test accessibility (alt text, keyboard navigation)

---

## Example Output Structure

### **Visual Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│   [IG] [FB] [YT] [TT] [LI]         │
│    ↑    ↑    ↑    ↑    ↑           │
│  Icons with spacing                 │
│                                     │
└─────────────────────────────────────┘
```

### **Code Structure:**
```html
<footer style="...">
  <div class="social-icons-container" style="...">
    <a href="..." class="social-icon-link" style="...">
      <img src="..." alt="Instagram">
    </a>
    <a href="..." class="social-icon-link" style="...">
      <img src="..." alt="Facebook">
    </a>
    <!-- More platforms -->
  </div>
</footer>
```

---

## Files to Modify

1. **`sections/footer.liquid`**
   - Add blocks schema for social media
   - Add global icon settings

2. **`snippets/footer-content.liquid`**
   - Replace text link with icon loop
   - Add placeholder logic
   - Update layout structure

3. **`/assets/` folder (optional)**
   - Add placeholder PNG/SVG files if using asset-based approach

---

## Platform Support List

**Primary Platforms:**
- ✅ Instagram
- ✅ Facebook
- ✅ YouTube
- ✅ Twitter/X
- ✅ TikTok
- ✅ LinkedIn

**Additional Platforms (can add later):**
- Pinterest
- Snapchat
- WhatsApp
- Telegram
- Discord
- Spotify
- Apple Music

---

## Questions to Confirm

1. **Which platforms** do you want to support initially?
   - All listed above or specific ones?

2. **Placeholder approach preference:**
   - SVG inline (simpler, always works)
   - PNG assets (more branded, requires files)

3. **Layout preference:**
   - Horizontal row only?
   - Or allow vertical stacking on mobile?

4. **Remove old text link?**
   - Keep "Follow us on instagram!" text above icons?
   - Or remove completely?

5. **Icon styling:**
   - Monochrome (single color)?
   - Or brand colors for placeholders?

---

## Summary

**Approach:** Blocks-based schema with SVG placeholders

**Benefits:**
- ✅ Flexible (easy to add/remove platforms)
- ✅ User-friendly (theme editor interface)
- ✅ Reliable (placeholders always available)
- ✅ Customizable (users can upload custom icons)
- ✅ Responsive (mobile-friendly)

**Implementation Steps:**
1. Update schema with blocks
2. Update Liquid logic for icon rendering
3. Create placeholder SVGs/icons
4. Add responsive CSS
5. Test all scenarios

Ready for review and confirmation! 🚀

