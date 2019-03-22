import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	localClassNames: 'product',
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
