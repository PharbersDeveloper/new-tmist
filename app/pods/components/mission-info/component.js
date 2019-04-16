import Component from '@ember/component';

export default Component.extend({
	classNames: ['p-4'],
	localClassNames: 'mission-info',
	bubble: false,
	onClick() { },
	click(params) {
		let action = this.get('onClick');

		action(params);

		return this.get('bubble');
	}
});
