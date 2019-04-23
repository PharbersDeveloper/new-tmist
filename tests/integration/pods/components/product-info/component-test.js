import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('product-info', 'Integration | Component | product info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{product-info}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#product-info}}
      template block text
    {{/product-info}}
  `);

  assert.dom('*').hasText('template block text');
});
