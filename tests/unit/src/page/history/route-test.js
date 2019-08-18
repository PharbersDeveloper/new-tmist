import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | page/history', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:page/history');
    assert.ok(route);
  });
});
