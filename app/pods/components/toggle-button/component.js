import Component from '@ember/component';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
	tagName: 'span',
	classNames: ['px-2', 'text-center'],
	localClassNames: 'toggle-button',
	localClassNameBindings: A(['choosed']),
	// choosed: equal('state', true),
	choosed: computed('state', function () {
		let state = this.get('state');

		if (state === 1 || Boolean(state)) {
			return true;
		}
		return false;
	}),
	click() {
		let action = this.get('changeState'),
			disabled = this.get('disabled'),
			state = this.get('state');

		// 如果 disalbed 为true，说明 超出。只有state 为true的点击有效
		if (!disabled || disabled && Boolean(state)) {
			action(this.get('context'), this.get('key'));
		}
	},
	changeState() { }
});
