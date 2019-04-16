import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table-display', 'Integration | Component | table display', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{table-display}}`);

  assert.dom('*').hasText('');

  // Template block usage:
  this.render(hbs`
    {{#table-display}}
      template block text
    {{/table-display}}
  `);

  assert.dom('*').hasText('template block text');
});
