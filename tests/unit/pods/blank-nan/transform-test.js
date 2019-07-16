import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:blank-nan', 'Unit | Transform | blank nan', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:blank-nan');
    assert.ok(transform);
  });
});
