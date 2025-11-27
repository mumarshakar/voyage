# Video Pixelation in Hero Section - Analysis

## 🔴 **ROOT CAUSE: CSS Forced Upscaling**

### **The Problem:**

**Current CSS (lines 142-147):**
```css
.hero-video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}
```

**What This Does:**
- Forces video to be AT LEAST 100% width AND 100% height of container
- If video is smaller than container, browser MUST upscale it
- Upscaling = pixelation (stretching pixels beyond native resolution)

### **Example:**
- Container: 1920px × 1080px
- Video native: 1280px × 720px
- CSS forces: min 1920px × 1080px
- Result: Video upscaled 150% = PIXELATED!

### **Why It Looks Good in Shopify Files:**
- When viewing files directly, you see native resolution
- No upscaling happening
- Browser displays original quality

### **Why It's Pixelated in Hero Section:**
- CSS forces upscaling beyond native resolution
- Browser stretches pixels to fill container
- Quality degradation visible

---

## ✅ **SOLUTION:**

Instead of forcing minimum dimensions, we should:
1. Use `width: 100%` and `height: 100%` (scales proportionally)
2. Let `object-fit: cover` handle the cropping
3. Don't force minimum dimensions that exceed video size
4. Ensure video scales down if needed, but doesn't force upscaling

**Better CSS:**
```css
.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

This will:
- Scale video to fill container proportionally
- Maintain aspect ratio
- Crop if needed (via object-fit: cover)
- NOT force upscaling beyond native resolution (will scale down if needed)

