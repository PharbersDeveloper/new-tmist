import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	classNames: ['mb-4', 'bg-white'],
	localClassNames: 'hospital',
	showContent: true,
	icon: computed('showContent', function () {
		let showContent = this.get('showContent');

		return showContent ? 'down' : 'up';
	}),
	actions: {
		showContent() {
			this.toggleProperty('showContent');
		}
	}
});
