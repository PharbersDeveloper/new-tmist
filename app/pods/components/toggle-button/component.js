import Component from '@ember/component';
import { A } from '@ember/array';
import { equal } from '@ember/object/computed';

export default Component.extend({
	tagName: 'span',
	classNames: ['px-2', 'text-center'],
	localClassNames: 'toggle-button',
	localClassNameBindings: A(['choosed']),
	choosed: equal('state', true),
	computedStateValue() {
		let { context, key } = this.getProperties('context', 'key');

		return context.get(key);
	},
	click() {
		let action = this.get('changeState'),
			disabled = this.get('disabled'),
			state = this.get('state');

		// 如果 disalbed 为true，说明 超出。只有state 为true的点击有效
		if (!disabled || disabled && Boolean(state)) {
			action(this.get('context'), this.get('key'));
		}
		this.set('state', this.computedStateValue());
	},
	changeState() { },
	didReceiveAttrs() {
		this._super(...arguments);
		this.set('state', this.computedStateValue());
	}
});
