import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:transforms/no-zero', 'Unit | Transform | transforms/no zero', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:transforms/no-zero');
    assert.ok(transform);
  });
});
