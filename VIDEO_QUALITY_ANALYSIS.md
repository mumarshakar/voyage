# Hero Section Video Pixelation - Deep Analysis

## 🔴 **ROOT CAUSE: Missing Video Quality Parameters**

### **Primary Issues Identified:**

### **1. No Explicit Video Quality/Resolution Control (CRITICAL)**

**Lines 482-484 (desktop) & 469-471 (mobile):**
```liquid
{% for source in desktop_video.sources %}
  <source src="{{ source.url }}" type="{{ source.mime_type }}">
{% endfor %}
```

**The Problem:**
- Shopify generates multiple video sources with different qualities (auto-adaptive)
- When you loop through `video.sources`, Shopify provides multiple `<source>` tags (e.g., 720p, 1080p, 4K variants)
- **The browser automatically chooses which quality to use** based on:
  - Available bandwidth
  - Viewport size
  - Device capabilities
  - Network conditions
- **No explicit quality control** - you're letting the browser decide, which often defaults to lower quality for faster loading

**Why It Looks Good on Laptop:**
- Your laptop might have:
  - Better internet connection (faster bandwidth detection)
  - Higher resolution screen (browser requests higher quality)
  - Better GPU (can handle higher quality playback)
  - Cached high-quality version

**Why It's Pixelated on Shopify Store:**
- Shopify's CDN might be serving optimized/compressed versions
- Browser is selecting lower quality to ensure fast loading
- Network throttling or slower connections trigger quality downgrade
- Mobile-first responsive design might trigger lower quality sources

---

### **2. Video Scaling/CSS Issues**

**Lines 138-149 in theme.css:**
```css
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
}
```

**The Problem:**
- Video is being **scaled up** to fill the container with `min-width: 100%` and `min-height: 100%`
- If Shopify serves a lower resolution video (e.g., 720p for a 1920px wide container), the video gets **upscaled**, causing pixelation
- No explicit video dimensions set, so browser uses whatever Shopify serves

---

### **3. Preload Strategy Issue**

**Lines 480 & 467:**
```html
preload="metadata"
```

**The Problem:**
- `preload="metadata"` only loads video metadata, not the video itself
- Browser can't determine quality until it starts loading
- Might cause browser to choose lower quality initially to start playback faster

---

### **4. Missing Video Quality Attributes**

**Current Code:**
- No `width` or `height` attributes on `<video>` element
- No explicit quality/resolution in source URLs
- No `quality` parameter in Shopify video URL

**Impact:**
- Browser doesn't know target resolution
- Shopify CDN serves "optimal" version which might be lower quality
- No way to force higher quality

---

### **5. Shopify Video Source Quality Behavior**

**How Shopify Handles Video Sources:**

When you upload a video to Shopify:
1. Shopify automatically generates **multiple quality versions** (transcoding)
2. Shopify creates a manifest with different bitrates/resolutions
3. The `video.sources` loop provides ALL available sources
4. Browser uses **adaptive bitrate streaming (ABR)** to choose quality
5. **Browser prioritizes speed over quality** - chooses lower quality to ensure smooth playback

**The sources Shopify provides typically include:**
- Low quality (for slow connections)
- Medium quality (default)
- High quality (for fast connections)
- Original quality (if file size allows)

**But there's NO way to force a specific quality** using just `source.url` - you're at the browser's mercy!

---

## 📋 **Why It Works Locally But Not on Shopify:**

### **Local/Laptop:**
- ✅ Direct file access = no compression
- ✅ No CDN optimization = original quality
- ✅ Better bandwidth detection = browser chooses higher quality
- ✅ No network throttling = can handle higher bitrates

### **Shopify Store:**
- ❌ CDN optimization = potentially compressed
- ❌ Adaptive streaming = browser chooses based on network
- ❌ Mobile-first = might serve mobile-optimized versions
- ❌ Network throttling = browser downgrades quality
- ❌ No explicit quality control = default behavior is "safe" (lower quality)

---

## ✅ **SOLUTION STRATEGY:**

### **Option 1: Use Shopify Video Transformation URLs (RECOMMENDED)**
- Use `video.sources[0].url` with explicit width parameter
- OR manually construct video URLs with quality parameters
- Specify target resolution explicitly

### **Option 2: Add Video Quality Attributes**
- Set explicit `width` and `height` attributes on video element
- Use `preload="auto"` instead of `preload="metadata"`
- Force browser to request higher quality

### **Option 3: Use External Video Hosting**
- Host videos on Vimeo/YouTube/Wistia for better quality control
- Use direct video CDN with quality parameters
- More control over video delivery

### **Option 4: Force Higher Quality Selection**
- Add JavaScript to force video quality after load
- Monitor video quality and upgrade if needed
- Use video API to control quality

---

## 🎯 **Root Cause Summary:**

1. **No explicit quality control** - relying on browser's adaptive streaming
2. **Shopify CDN optimization** - may compress/serve lower quality versions
3. **Video scaling** - lower resolution videos being upscaled causes pixelation
4. **Adaptive bitrate streaming** - browser chooses quality based on network, often defaulting to lower quality
5. **Missing video dimensions** - browser can't determine optimal quality

**The core issue: You're letting the browser and Shopify's CDN decide video quality, and they're choosing lower quality for performance reasons.**

