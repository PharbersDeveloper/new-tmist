import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | page-report', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:page-report');
    assert.ok(controller);
  });
});
