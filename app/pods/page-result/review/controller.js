import Controller from '@ember/controller';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Controller.extend({
	groupValue: 1,
	sortRules: A([
		{ name: '按潜力', value: 0 },
		{ name: '按销售额', value: 1 }
	]),
	sortData: computed('tmpSr.{name}', function () {
		let data = this.get('model').destConfigs,
			tmpSr = this.get('tmpSr');

		if (typeof tmpSr === 'undefined') {
			return A([]);
		}
		if (tmpSr.value === 0) {
			return data.sortBy('hospitalConfig.potential');
		}
		return data.sortBy('hospitalConfig.sales');
	})

});
