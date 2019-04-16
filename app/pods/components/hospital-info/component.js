import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	classNames: ['mb-4', 'bg-white'],
	localClassNames: 'hospital',
	showContent: false,
	icon: computed('showContent', function () {
		let showContent = this.get('showContent');

		return showContent ? 'down' : 'right';
	}),
	actions: {
		showContent() {
			this.toggleProperty('showContent');
		}
	}
});
