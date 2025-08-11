module.exports = {
  plugins: [
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-declaration-strict-value'
  ],
  rules: {
    'declaration-no-important': true,
    'max-nesting-depth': 3,
    'selector-class-pattern': '^(c|u|is|js)-[a-z0-9-]+$',
    'no-descending-specificity': true,
    'custom-property-pattern': '^[a-z0-9-]+$',
    'plugin/declaration-block-no-ignored-properties': true,
    'scale-unlimited/declaration-strict-value': [
      ['color', 'background-color', 'border-color', 'outline-color', 'stroke', 'fill'],
      {
        ignoreValues: ['currentColor', 'inherit', 'transparent', 'none']
      }
    ],
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'order/order': [['custom-properties', 'declarations']],
    'order/properties-alphabetical-order': true
  }
};
