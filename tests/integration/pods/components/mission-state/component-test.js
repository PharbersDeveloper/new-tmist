import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mission-state', 'Integration | Component | mission state', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mission-state}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#mission-state}}
      template block text
    {{/mission-state}}
  `);

  assert.dom('*').hasText('template block text');
});
