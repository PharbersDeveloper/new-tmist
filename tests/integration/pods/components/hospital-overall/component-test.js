import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hospital-overall', 'Integration | Component | hospital overall', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hospital-overall}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#hospital-overall}}
      template block text
    {{/hospital-overall}}
  `);

  assert.dom('*').hasText('template block text');
});
