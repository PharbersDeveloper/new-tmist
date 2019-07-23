import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | page/project/report', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:page/project/report');
    assert.ok(route);
  });
});
