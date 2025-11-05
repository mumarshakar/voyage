# Booking Calendar System - Implementation Guide

## Overview

This guide explains how the booking calendar system works in Shopify and how to implement it in your theme.

## Understanding Booking Systems in Shopify

### Shopify's Native Capabilities

Shopify is primarily an e-commerce platform, not a native booking/appointment management system. However, you can create a booking calendar interface in several ways:

1. **Visual Calendar Only (This Implementation)**
   - Displays a calendar with event images
   - Shows dates with scheduled events
   - Requires integration with booking apps for actual reservations

2. **Shopify Booking Apps** (Recommended for Full Functionality)
   - Apps like "BookThatApp", "Appointly", "Booking & Appointment Master", "Sesami"
   - Handle availability, payments, notifications
   - Provide widgets that can be embedded

3. **External Booking Systems**
   - Integrate with Acuity Scheduling, Calendly, Mindbody, Vagaro
   - Embed their calendar widgets via iframe or JavaScript

4. **Custom Development** (Advanced)
   - Full control but requires significant development
   - Needs separate backend for real-time availability
   - Complex booking logic and payment integration

## What This Implementation Provides

This booking calendar section provides:

✅ **Visual Calendar Grid**
- Monthly calendar view matching your design
- Month/year navigation with arrow buttons
- Responsive design (mobile-friendly)

✅ **Event Management**
- Add events via theme customizer (blocks)
- Each event has:
  - Day of month (1-31)
  - Event image
  - Event title (alt text)
  - Optional link (clickable event days)

✅ **Customization Options**
- Background color
- Padding and margins
- Font families and colors
- Heading and weekday styling

## How to Use

### Step 1: Add the Section to a Page

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **"Customize"** on your active theme
3. Navigate to the page where you want the calendar (e.g., create/edit a "Bookings" page)
4. Click **"Add section"** in the left sidebar
5. Select **"Booking Calendar"**
6. Configure the settings as needed

### Step 2: Add Events

1. In the theme customizer, click on the **"Booking Calendar"** section
2. Scroll down to the **"Blocks"** area
3. Click **"Add block"** and select **"Event"**
4. For each event, configure:
   - **Day of Month**: 1-31 (when the event occurs)
   - **Event Image**: Upload an image for this day
   - **Event Title**: Alt text for the image
   - **Event Link**: (Optional) URL to visit when clicking the event day

5. Repeat for all events you want to display

### Step 3: Customize Appearance

In the section settings, you can adjust:

- **Section Spacing**: Padding and margins
- **Background Color**: Calendar section background
- **Calendar Header**: Month/year display styling
- **Weekdays**: Font and color for day abbreviations
- **Day Numbers**: Color for date numbers

## File Structure

```
sections/
  └── booking-calendar.liquid    # Main calendar section

snippets/
  ├── icon-arrow-left.liquid      # Left navigation arrow
  └── icon-arrow-right.liquid     # Right navigation arrow

assets/
  └── theme.css                   # Calendar styles (already added)
```

## Features

### Month Navigation

- Click the left/right arrows to navigate between months
- Calendar automatically calculates:
  - Days in the month
  - First day of the week
  - Proper grid layout

### Event Display

- Events appear as images on their respective days
- Days with events have a highlighted border
- Hover effect on event days
- Clickable if event link is provided

### Responsive Design

- **Desktop**: Full 7-column grid with larger images
- **Tablet**: Adjusted spacing and smaller images
- **Mobile**: Compact layout, smaller day cells

## Limitations & Next Steps

### Current Limitations

This implementation provides the **visual calendar only**. For a fully functional booking system, you need:

1. **Availability Management**
   - Track which time slots are available
   - Prevent double-booking
   - Handle capacity limits

2. **Booking Logic**
   - Process reservations
   - Send confirmation emails
   - Handle cancellations/modifications

3. **Payment Integration**
   - Connect to Shopify checkout
   - Handle deposits or full payments

### Recommended Next Steps

#### Option 1: Use a Shopify Booking App (Easiest)

1. Install a booking app from the Shopify App Store:
   - BookThatApp
   - Appointly
   - Booking & Appointment Master
   - Sesami

2. Configure your services/classes in the app

3. Replace the calendar section with the app's widget code

#### Option 2: Integrate External Booking System

1. Choose a booking platform (Acuity, Calendly, etc.)

2. Create an account and set up your services

3. Get the embed code/widget

4. Create a new section that embeds the widget:
   ```liquid
   <div class="booking-widget-wrapper">
     <!-- Embed your booking widget here -->
     <iframe src="YOUR_BOOKING_URL" ...></iframe>
   </div>
   ```

#### Option 3: Build Custom Booking Logic (Advanced)

This requires:

1. **Backend Application**
   - Node.js, Ruby on Rails, or similar
   - Database to store bookings
   - API endpoints for availability checks

2. **Shopify App**
   - Custom app to handle booking data
   - Integration with Shopify's Admin API
   - Metafields or custom resources for bookings

3. **Frontend Updates**
   - Time slot selection
   - Booking form
   - Availability checking via AJAX
   - Cart integration for payments

4. **Notification System**
   - Email confirmations
   - Reminders
   - Admin notifications

## Technical Details

### JavaScript Functionality

The calendar uses vanilla JavaScript to:
- Calculate month dates dynamically
- Render the calendar grid
- Handle month navigation
- Display event images based on block settings

### Event Data Storage

Events are stored as section blocks in the theme customizer. Each block contains:
- Event day (1-31)
- Event image URL
- Event title
- Event link (optional)

### Responsive Breakpoints

- **Desktop**: Default (no media query)
- **Tablet**: `@media (max-width: 768px)`
- **Mobile**: `@media (max-width: 480px)`

## Customization Examples

### Change Calendar Colors

In the theme customizer:
- Section Settings → Background Color
- Calendar Header → Heading Color
- Weekdays → Weekday Text Color
- Day Numbers → Day Number Color

### Adjust Spacing

- Section Settings → Padding Top/Bottom
- Section Settings → Padding Horizontal
- Section Settings → Margin Top/Bottom

### Change Fonts

- Calendar Header → Heading Font Family
- Weekdays → Weekday Font Family

## Troubleshooting

### Events Not Showing

1. Check that events are added as blocks in the theme customizer
2. Verify the "Day of Month" is set correctly (1-31)
3. Ensure event images are uploaded
4. Check browser console for JavaScript errors

### Calendar Not Rendering

1. Verify `sections/booking-calendar.liquid` exists
2. Check that `snippets/icon-arrow-left.liquid` and `icon-arrow-right.liquid` exist
3. Ensure CSS is added to `assets/theme.css`
4. Check browser console for errors

### Navigation Not Working

1. Verify JavaScript is enabled in the browser
2. Check for JavaScript errors in console
3. Ensure the section ID is unique (should be automatic)

## Support

For questions or issues:
1. Check the Shopify Theme Documentation
2. Review Shopify Community Forums
3. Consider hiring a Shopify developer for custom booking logic

---

**Note**: This implementation provides a beautiful visual calendar. For actual booking functionality, integrate with a booking app or build a custom booking system.

