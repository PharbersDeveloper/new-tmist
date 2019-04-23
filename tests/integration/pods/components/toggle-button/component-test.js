import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('toggle-button', 'Integration | Component | toggle button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{toggle-button}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#toggle-button}}
      template block text
    {{/toggle-button}}
  `);

  assert.dom('*').hasText('template block text');
});
