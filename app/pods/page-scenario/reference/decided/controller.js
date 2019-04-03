import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
	decidedContent: A([
		{ name: '管理决策', value: 0 },
		{ name: '业务决策', value: 1 }
	]),
	init() {
		this._super(...arguments);
		this.set('tmpDecided', { name: '管理决策', value: 0 });
	}
});
