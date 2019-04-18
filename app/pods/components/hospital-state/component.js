import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
	localClassNames: 'state',
	localClassNameBindings: A(['pending', 'done']),
	pending: equal('state', false),
	done: equal('state', true),
	stateText: computed('state', function () {
		let state = this.get('state');

		if (state === false) {
			return '待分配';
		}
		return '已分配';
	})
}).reopenClass({
	positionalParams: ['state']
});
