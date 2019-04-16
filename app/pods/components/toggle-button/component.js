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
		let action = this.get('changeState');

		action(this.get('context'), this.get('key'));
		this.set('state', this.computedStateValue());
	},
	changeState() {
	},
	didReceiveAttrs() {
		this._super(...arguments);
		this.set('state', this.computedStateValue());
	}
});
