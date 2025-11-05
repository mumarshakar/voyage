# Troubleshooting: Booking Calendar Not Appearing in Add Section List

## Issue
The booking calendar section exists in GitHub and theme code editor, but doesn't appear in the "Add section" dropdown in the Shopify theme customizer.

## Solutions (Try in Order)

### Solution 1: Hard Refresh Theme Customizer
1. **Close and reopen the theme customizer**
   - Exit the theme customizer completely
   - Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
   - Reopen the theme customizer

2. **Hard refresh the browser**
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

### Solution 2: Verify File Location
1. Go to **Shopify Admin → Online Store → Themes**
2. Click **"Actions" → "Edit code"**
3. Navigate to `sections/booking-calendar.liquid`
4. Verify the file exists and has content
5. Check that the file name is exactly `booking-calendar.liquid` (lowercase, hyphen)

### Solution 3: Manual File Upload (Force Re-index)
1. Go to **Shopify Admin → Online Store → Themes → Actions → Edit code**
2. Navigate to `sections/booking-calendar.liquid`
3. **Delete the file** (make a backup first!)
4. **Re-upload** the file from GitHub
   - Copy the entire contents from GitHub
   - Create a new file with the same name
   - Paste the content
   - Save
5. **Hard refresh** the theme customizer

### Solution 4: Check Schema Validity
The schema should be valid JSON. Verify:
- All quotes are properly escaped
- All brackets are balanced
- No trailing commas

### Solution 5: Add Section to Template (Temporary)
Sometimes adding a section to a template JSON file helps Shopify recognize it:

1. Go to **Shopify Admin → Online Store → Themes → Actions → Edit code**
2. Open `templates/page.json` (or any page template)
3. Add the booking calendar section temporarily:
   ```json
   {
     "sections": {
       "booking_calendar_temp": {
         "type": "booking-calendar",
         "settings": {}
       }
     },
     "order": ["booking_calendar_temp"]
   }
   ```
4. Save and check if it appears in "Add section"
5. If it works, you can remove it from the template

### Solution 6: Check for JavaScript Errors
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Check for any JavaScript errors related to the booking calendar
4. Fix any errors found

### Solution 7: Verify Preset Structure
The preset should have:
- `name`: "Booking Calendar"
- `category`: "Custom" (optional but recommended)
- `settings`: {} (can be empty object)
- `blocks`: Array of block definitions (optional)

### Solution 8: Wait for Shopify to Re-index
Sometimes Shopify takes a few minutes to re-index new sections:
- Wait 5-10 minutes after uploading/changing the file
- Try refreshing the theme customizer again

### Solution 9: Check File Permissions
Ensure the file has proper permissions and isn't corrupted:
- File should be readable
- No special characters in filename
- Correct file extension (.liquid)

### Solution 10: Contact Shopify Support
If none of the above work, contact Shopify Support with:
- Theme name
- Section file name
- Screenshot of the "Add section" dropdown
- Description of the issue

## Common Causes

1. **Caching Issues**: Shopify's theme customizer caches section lists
2. **File Not Synced**: File exists locally but not on Shopify servers
3. **Schema Errors**: Invalid JSON in the schema block
4. **Re-indexing Delay**: Shopify needs time to scan new sections
5. **Browser Cache**: Old cached version of the theme customizer

## Verification Checklist

- [ ] File exists in `sections/booking-calendar.liquid`
- [ ] File has valid Liquid syntax
- [ ] Schema block is valid JSON
- [ ] Preset is defined with name "Booking Calendar"
- [ ] No JavaScript errors in console
- [ ] Hard refreshed browser
- [ ] Waited 5-10 minutes for re-indexing
- [ ] Tried different browser
- [ ] Cleared browser cache

## Expected Behavior

After a successful fix, you should see:
- **"Booking Calendar"** appears in the "Add section" dropdown
- It appears under the "Custom" category (if you have categories)
- You can click it to add the section to your page
- The section settings appear in the right sidebar

## Still Not Working?

If the section still doesn't appear after trying all solutions:
1. Check if other custom sections (like "Custom Text") appear in the list
2. If they don't, there might be a theme-wide issue
3. If they do, the booking calendar section might have a specific issue

Consider:
- Re-downloading the section file from GitHub
- Comparing the schema structure with a working section (like custom-text.liquid)
- Checking for any Liquid syntax errors in the file

