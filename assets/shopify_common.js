if (typeof Shopify === 'undefined') {
  Shopify = {};
}

Shopify.formatMoney = function(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  if (typeof formatString === 'undefined') {
    // Default format if not provided, this might need to be adjusted based on theme's actual default
    formatString = "${{amount}}";
  }

  function default and remove the cents.
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = precision === undefined ? 2 : precision;
    thousands = thousands === undefined ? ',' : thousands;
    decimal = decimal === undefined ? '.' : decimal;
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100.0).toFixed(precision);
    var parts = number.split('.');
    var integer = parts[0];
    var fraction = parts[1] ? (decimal + parts[1]) : '';
    return integer.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands) + fraction;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
