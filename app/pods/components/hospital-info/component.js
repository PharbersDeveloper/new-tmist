import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
	classNames: ['mb-4', 'bg-white'],
	localClassNames: 'hospital',
	showContent: true,
	icon: computed('showContent', function () {
		let showContent = this.get('showContent');

		return showContent ? 'down' : 'right';
	}),
	barData: A([
		{
			name: '直接访问',
			date: ['2018年第1季度', '2018年第2季度', '2018年第3季度', '2018年第4季度'],
			sales: [10, 52, 200, 445],
			targets: [555, 555, 555, 555],
			rates: ['39%', '23%', '13%', '33%']
		}
	]),
	actions: {
		showContent() {
			this.toggleProperty('showContent');
		}
	}
});
