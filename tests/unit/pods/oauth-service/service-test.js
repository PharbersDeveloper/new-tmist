import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | oauth-service', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:oauth-service');
    assert.ok(service);
  });
});
