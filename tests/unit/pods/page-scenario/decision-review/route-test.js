import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | page-scenario/decision-review', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:page-scenario/decision-review');
    assert.ok(route);
  });
});
