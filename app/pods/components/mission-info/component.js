import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
	classNames: ['p-4'],
	localClassNames: 'mission-info',
	classNameBindings: ['isMultiplePhase:multiple-phase'],
	localClassNameBindings: A(['isMultiplePhase:multiple-phase']),
	bubble: false,
	isMultiplePhase: computed('useableProposal.proposal.totalPhase', function () {
		let quantity = this.get('useableProposal.proposal.totalPhase');

		if (quantity > 0) {
			return true;
		}
		return false;
	}),
	onClick() { },
	click(params) {
		let action = this.get('onClick');

		action(params);

		return this.get('bubble');
	}
});
