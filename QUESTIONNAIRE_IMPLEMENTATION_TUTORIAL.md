# Product Questionnaire Implementation Tutorial

## Overview
This tutorial explains how to implement a mandatory questionnaire on product pages that appears after the product price and before the quantity selector. The questionnaire data will be stored with cart items and displayed on both the cart page and order confirmation page.

---

## 1. Requirements Analysis

### 1.1 Questionnaire Fields (Based on Image)
- **Food Allergies** (Textarea, Required) - "Do you have any food allergies? *"
- **Injuries** (Textarea, Required) - "Do you have any injuries? *"
- **Celebrations** (Textarea, Required) - "Are you sharing any celebrations with us aboard? *"
- **Anything Else** (Textarea, Required) - "Anything else you would like us to know? *"
- **Terms & Conditions** (Checkbox, Required) - "Do you agree to the terms and conditions? *"

### 1.2 Placement
- **Location:** Product page, inside `product-details.liquid`
- **Position:** After product price (line 32), before quantity selector (line 119)
- **Visual:** Card-based design matching existing product form cards

### 1.3 Data Storage
- **Method:** Shopify Cart Item Properties
- **Format:** Each answer stored as a property with key-value pairs
- **Persistence:** Automatically included in order when checkout completes

### 1.4 Display Locations
1. **Product Page:** Form fields (editable before add to cart)
2. **Cart Page:** Display as read-only text below each cart item
3. **Order Page:** Automatically included (Shopify default behavior for properties)

---

## 2. HTML Structure Tutorial

### 2.1 Product Page Questionnaire Form

```html
<!-- QUESTIONNAIRE CARD - Insert after product price, before quantity selector -->
<div class="card mb-3" style="background-color: #f8f9fa;" id="product-questionnaire-card">
  <div class="card-body">
    <h6 class="card-title mb-3 fw-semibold">Additional Information</h6>
    <p class="text-muted small mb-3">Please fill out the following information (all fields are required)</p>
    
    <div class="product-questionnaire-form" id="product-questionnaire-form">
      <!-- Food Allergies Field -->
      <div class="mb-3">
        <label for="questionnaire-food-allergies" class="form-label fw-semibold">
          Do you have any food allergies? <span class="text-danger">*</span>
        </label>
        <textarea 
          class="form-control questionnaire-field" 
          id="questionnaire-food-allergies" 
          name="properties[Food Allergies]"
          rows="3" 
          required
          placeholder="Please list any food allergies or dietary restrictions..."
        ></textarea>
        <div class="invalid-feedback">This field is required.</div>
      </div>

      <!-- Injuries Field -->
      <div class="mb-3">
        <label for="questionnaire-injuries" class="form-label fw-semibold">
          Do you have any injuries? <span class="text-danger">*</span>
        </label>
        <textarea 
          class="form-control questionnaire-field" 
          id="questionnaire-injuries" 
          name="properties[Injuries]"
          rows="3" 
          required
          placeholder="Please list any injuries or physical limitations..."
        ></textarea>
        <div class="invalid-feedback">This field is required.</div>
      </div>

      <!-- Celebrations Field -->
      <div class="mb-3">
        <label for="questionnaire-celebrations" class="form-label fw-semibold">
          Are you sharing any celebrations with us aboard? <span class="text-danger">*</span>
        </label>
        <textarea 
          class="form-control questionnaire-field" 
          id="questionnaire-celebrations" 
          name="properties[Celebrations]"
          rows="3" 
          required
          placeholder="Birthday, anniversary, or other special occasion..."
        ></textarea>
        <div class="invalid-feedback">This field is required.</div>
      </div>

      <!-- Anything Else Field -->
      <div class="mb-3">
        <label for="questionnaire-anything-else" class="form-label fw-semibold">
          Anything else you would like us to know? <span class="text-danger">*</span>
        </label>
        <textarea 
          class="form-control questionnaire-field" 
          id="questionnaire-anything-else" 
          name="properties[Anything Else]"
          rows="3" 
          required
          placeholder="Any additional information or special requests..."
        ></textarea>
        <div class="invalid-feedback">This field is required.</div>
      </div>

      <!-- Terms & Conditions Checkbox -->
      <div class="mb-3">
        <div class="form-check">
          <input 
            class="form-check-input questionnaire-field" 
            type="checkbox" 
            id="questionnaire-terms" 
            name="properties[Terms Accepted]"
            value="Yes"
            required
          >
          <label class="form-check-label" for="questionnaire-terms">
            Do you agree to the terms and conditions? <span class="text-danger">*</span>
            <a href="/pages/terms-conditions" target="_blank" class="ms-1" style="text-decoration: none;">
              <i class="bi bi-file-text" style="font-size: 14px;"></i>
            </a>
          </label>
          <div class="invalid-feedback">You must agree to the terms and conditions.</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2.2 Key HTML Attributes Explained

#### Form Field Naming Convention
```html
name="properties[Field Name]"
```
- **Why:** Shopify automatically stores fields with `properties[]` prefix as cart item properties
- **Format:** `properties[Display Name]` - The text inside brackets becomes the property label
- **Example:** `name="properties[Food Allergies]"` creates a property with key "Food Allergies"

#### Required Fields
```html
required
```
- **Why:** HTML5 validation prevents form submission if empty
- **Behavior:** Browser shows native validation message
- **Custom:** We'll add JavaScript validation for better UX

#### CSS Classes
- `questionnaire-field` - For JavaScript validation and styling
- `form-control` - Bootstrap styling for form inputs
- `invalid-feedback` - Bootstrap validation message container

---

## 3. JavaScript Validation & Data Handling

### 3.1 Form Validation Before Add to Cart

```javascript
// Validate questionnaire before allowing add to cart
function validateQuestionnaire() {
  const form = document.getElementById('product-questionnaire-form');
  const fields = form.querySelectorAll('.questionnaire-field[required]');
  let isValid = true;
  
  // Remove previous validation states
  fields.forEach(field => {
    field.classList.remove('is-invalid', 'is-valid');
  });
  
  // Validate each field
  fields.forEach(field => {
    if (field.type === 'checkbox') {
      if (!field.checked) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.add('is-valid');
      }
    } else {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.add('is-valid');
      }
    }
  });
  
  return isValid;
}

// Intercept form submission
document.getElementById('product-form').addEventListener('submit', function(e) {
  if (!validateQuestionnaire()) {
    e.preventDefault();
    e.stopPropagation();
    
    // Scroll to first invalid field
    const firstInvalid = document.querySelector('.questionnaire-field.is-invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }
    
    // Show alert
    alert('Please complete all required fields in the questionnaire before adding to cart.');
    return false;
  }
});
```

### 3.2 Collecting Properties for AJAX Add to Cart

```javascript
// Function to collect questionnaire data as properties array
function getQuestionnaireProperties() {
  const properties = [];
  const form = document.getElementById('product-questionnaire-form');
  const fields = form.querySelectorAll('.questionnaire-field');
  
  fields.forEach(field => {
    if (field.type === 'checkbox') {
      if (field.checked) {
        properties.push({
          name: field.name.replace('properties[', '').replace(']', ''),
          value: field.value
        });
      }
    } else {
      if (field.value.trim()) {
        properties.push({
          name: field.name.replace('properties[', '').replace(']', ''),
          value: field.value.trim()
        });
      }
    }
  });
  
  return properties;
}

// Modify existing add-to-cart function to include properties
function addToCart() {
  if (!validateQuestionnaire()) {
    alert('Please complete all required fields in the questionnaire.');
    return;
  }
  
  const formData = new FormData();
  formData.append('id', document.getElementById('selected-variant-id').value);
  formData.append('quantity', document.getElementById('quantity').value);
  
  // Add questionnaire properties
  const properties = getQuestionnaireProperties();
  properties.forEach((prop, index) => {
    formData.append(`properties[${prop.name}]`, prop.value);
  });
  
  // Continue with existing fetch logic...
}
```

---

## 4. Cart Page Display

### 4.1 Displaying Questionnaire Data on Cart Page

```liquid
{%- for item in cart.items -%}
  <div class="row align-items-center mb-3 pb-3 {% unless forloop.last %}border-bottom{% endunless %} cart-item" data-key="{{ item.key }}">
    <!-- Existing cart item display code -->
    
    <!-- ADD THIS: Display questionnaire properties -->
    {%- if item.properties.size > 0 -%}
      <div class="col-12 mt-3">
        <div class="card" style="background-color: #f9f9f9; border: 1px solid #e9ecef;">
          <div class="card-body p-3">
            <h6 class="card-title mb-2" style="font-size: 14px; font-weight: 600;">Additional Information:</h6>
            <div class="questionnaire-display">
              {%- for property in item.properties -%}
                {%- unless property.first == '_' -%}
                  {%- unless property.first == 'First Name' or property.first == 'Last Name' -%}
                    <div class="mb-2" style="font-size: 13px;">
                      <strong>{{ property.first }}:</strong>
                      <span class="text-muted ms-1">{{ property.last }}</span>
                    </div>
                  {%- endunless -%}
                {%- endunless -%}
              {%- endfor -%}
            </div>
          </div>
        </div>
      </div>
    {%- endif -%}
  </div>
{%- endfor -%}
```

### 4.2 Key Liquid Logic Explained

- `item.properties` - Array of all properties attached to cart item
- `property.first` - Property key/name (e.g., "Food Allergies")
- `property.last` - Property value (e.g., "Peanuts, Dairy")
- `unless property.first == '_'` - Excludes internal Shopify properties
- `unless property.first == 'First Name' or property.first == 'Last Name'` - Excludes name fields (collected at checkout)

---

## 5. Order Page Display

### 5.1 Automatic Display
Shopify automatically displays cart item properties on:
- Order confirmation page
- Order status page
- Admin order details
- Customer account order history

**No additional code needed!** Properties are included in the order object.

### 5.2 Customization (Optional)
If you want to customize the order confirmation page display, you can access properties via:
```liquid
{%- for line_item in order.line_items -%}
  {%- for property in line_item.properties -%}
    {{ property.first }}: {{ property.last }}
  {%- endfor -%}
{%- endfor -%}
```

---

## 6. Visual Design & Styling

### 6.1 Card Styling (Matches Existing Design)
```css
#product-questionnaire-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

#product-questionnaire-card .card-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.questionnaire-field:focus {
  border-color: var(--primary-orange, #FF6B35);
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.questionnaire-field.is-invalid {
  border-color: #dc3545;
}

.questionnaire-field.is-valid {
  border-color: #28a745;
}
```

### 6.2 Responsive Design
- Fields stack vertically on mobile
- Textareas expand to full width
- Checkbox aligns properly on all screen sizes

---

## 7. Implementation Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  PRODUCT PAGE                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Product Title                                      │ │
│  │ Product Price ← INSERT QUESTIONNAIRE AFTER THIS   │ │
│  │ ┌───────────────────────────────────────────────┐ │ │
│  │ │ Questionnaire Form (Required)                 │ │ │
│  │ │ - Food Allergies                              │ │ │
│  │ │ - Injuries                                    │ │ │
│  │ │ - Celebrations                                │ │ │
│  │ │ - Anything Else                               │ │ │
│  │ │ - Terms & Conditions                          │ │ │
│  │ └───────────────────────────────────────────────┘ │ │
│  │ Quantity Selector ← INSERT QUESTIONNAIRE BEFORE    │ │
│  │ Add to Cart Button                                │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        │ User fills form & clicks "Add to Cart"
                        ▼
┌─────────────────────────────────────────────────────────┐
│  VALIDATION                                             │
│  ✓ All textareas filled?                               │
│  ✓ Terms checkbox checked?                             │
│  └─ NO → Show error, prevent submission                │
│  └─ YES → Continue                                     │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Validation passed
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ADD TO CART (with properties)                          │
│  POST /cart/add.js                                      │
│  {                                                      │
│    id: variant_id,                                      │
│    quantity: 1,                                         │
│    properties: {                                        │
│      "Food Allergies": "Peanuts, Dairy",               │
│      "Injuries": "None",                                │
│      "Celebrations": "Birthday",                        │
│      "Anything Else": "Window seat preferred",          │
│      "Terms Accepted": "Yes"                             │
│    }                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                        │
                        │ Item added to cart
                        ▼
┌─────────────────────────────────────────────────────────┐
│  CART PAGE                                              │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Product Image | Product Title | Price | Quantity  │ │
│  │ ┌───────────────────────────────────────────────┐ │ │
│  │ │ Additional Information:                       │ │ │
│  │ │ Food Allergies: Peanuts, Dairy                │ │ │
│  │ │ Injuries: None                                │ │ │
│  │ │ Celebrations: Birthday                        │ │ │
│  │ │ Anything Else: Window seat preferred         │ │ │
│  │ │ Terms Accepted: Yes                           │ │ │
│  │ └───────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        │ User proceeds to checkout
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ORDER CONFIRMATION PAGE                                │
│  (Shopify automatically includes properties)           │
│  Properties visible in:                                 │
│  - Order confirmation email                             │
│  - Admin order details                                  │
│  - Customer account order history                        │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Technical Considerations

### 8.1 Shopify Cart Properties Limitations
- **Max Properties:** 100 properties per cart item
- **Property Name Length:** Max 100 characters
- **Property Value Length:** Max 5,000 characters
- **Our Use Case:** 5 properties, well within limits ✓

### 8.2 Data Persistence
- Properties persist through:
  - Cart updates
  - Page refreshes
  - Browser sessions (if cart is saved)
- Properties are lost if:
  - Cart is cleared
  - Item is removed and re-added (user must fill form again)

### 8.3 Handling Multiple Quantities
- **Current Design:** One questionnaire per cart item
- **Behavior:** If user adds quantity 2, both items have same properties
- **Alternative:** Could implement per-quantity questionnaire (more complex)

### 8.4 Edit Functionality
- **Cart Page:** Properties are read-only (Shopify limitation)
- **Solution:** User must remove item and re-add with new answers
- **Alternative:** Could implement cart update API with properties (advanced)

---

## 9. Testing Checklist

### 9.1 Product Page
- [ ] Questionnaire appears after price, before quantity
- [ ] All fields are marked as required (red asterisk)
- [ ] Form validation prevents submission with empty fields
- [ ] Checkbox validation works correctly
- [ ] Error messages display properly
- [ ] Form scrolls to first invalid field on error

### 9.2 Add to Cart
- [ ] Properties are included in cart add request
- [ ] Validation runs before AJAX request
- [ ] Success: Item added with properties
- [ ] Error: User sees validation message

### 9.3 Cart Page
- [ ] Properties display below each cart item
- [ ] Properties are formatted correctly
- [ ] First Name/Last Name are excluded (if present)
- [ ] Properties persist after page refresh
- [ ] Properties persist after quantity update

### 9.4 Order Page
- [ ] Properties appear on order confirmation
- [ ] Properties appear in order email
- [ ] Properties appear in admin order details

---

## 10. File Changes Summary

### Files to Modify:
1. **`snippets/product-details.liquid`**
   - Add questionnaire HTML after price (line 32)
   - Add JavaScript validation
   - Modify add-to-cart function to include properties

2. **`sections/cart-main.liquid`**
   - Add property display section in cart item loop
   - Style questionnaire display

### Files to Review (No Changes):
- `sections/product-main.liquid` - May need to pass properties in AJAX
- Order confirmation templates - Properties display automatically

---

## 11. Next Steps

1. **Review this tutorial** - Confirm approach meets requirements
2. **Confirm implementation** - Approve to proceed with code changes
3. **Implementation** - Code will be added to appropriate files
4. **Testing** - Test on development store
5. **Deployment** - Deploy to production

---

## Questions or Concerns?

Please review this tutorial and let me know:
- Does this approach meet your requirements?
- Any changes needed to the field structure?
- Any additional validation rules?
- Any styling preferences?

Once confirmed, I'll implement the code changes.

