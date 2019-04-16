import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
	localClassNames: 'state',
	localClassNameBindings: A(['missionNew', 'missionDone']),
	missionNew: equal('state', 0),
	missionDone: equal('state', 3),
	stateText: computed('state', function () {
		let state = this.get('state');

		if (state === 0) {
			return '新任务';
		} else if (state === 3) {
			return '已完成';
		}
		return '进行中';
	})
}).reopenClass({
	positionalParams: ['state']
});
