import EmberObject from '@ember/object';
import GenerateConditionMixin from 'new-tmist/mixins/generate-condition';
import { module, test } from 'qunit';

module('Unit | Mixin | generateCondition', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let GenerateConditionObject = EmberObject.extend(GenerateConditionMixin);
    let subject = GenerateConditionObject.create();
    assert.ok(subject);
  });
});
