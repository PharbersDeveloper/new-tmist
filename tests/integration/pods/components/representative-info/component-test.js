import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('representative-info', 'Integration | Component | representative info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{representative-info}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#representative-info}}
      template block text
    {{/representative-info}}
  `);

  assert.dom('*').hasText('template block text');
});
