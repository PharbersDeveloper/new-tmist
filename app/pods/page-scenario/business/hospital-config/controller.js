import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	// IndicatorAllocationPercent: computed('businessinput.salesTarget', function () {
	// 	let { totalBusinessIndicators, businessinput } =
	// 		this.getProperties('totalBusinessIndicators', 'businessinput'),
	// 		salesTarget = businessinput.get('salesTarget');

	// 	if (salesTarget === 0 || typeof totalBusinessIndicators === 'undefined') {
	// 		return 0;
	// 	}
	// 	return (salesTarget / totalBusinessIndicators).toFixed(2) * 100;

	// }),
	// budgetNumber: computed('businessinput.budget', function () {
	// 	let { totalBudgets, businessinput } =
	// 		this.getProperties('totalBudgets', 'businessinput'),
	// 		budget = businessinput.get('budget');

	// 	if (budget === 0 || typeof totalBudgets === 'undefined') {
	// 		return 0;
	// 	}
	// 	return (budget / 100 * totalBudgets).toFixed(2);
	// }),
	// 代表分配时间percent
	representativesVisitPercent: computed('businessinput.visitTime', 'tmpRc', function () {
		let resourceConfigs = this.get('model').repConf,
			result = A([]),
			newBusinessinputs = this.get('store').peekAll('businessinput').filter(ele => ele.get('isNew')),
			that = this;

		result = resourceConfigs.map(ele => {

			let usedTime = 0,
				totalTime = ele.get('representativeConfig.totalTime');

			newBusinessinputs.map(nbi => {
				if (ele.get('id') === nbi.get('resourceConfigId')) {
					usedTime += Number(nbi.get('visitTime'));
				}
			});
			return {
				id: ele.get('id'),
				totalTime,
				usedTime,
				restTime: 100 - usedTime
				// usedPercent: that.computedPercentage(usedTime, totalTime)
			};
		});

		return result;

	}),
	computedPercentage(numerator, denominator, tofixed = 2) {
		if (isEmpty(denominator) || isEmpty(numerator)) {
			return 100;
		}
		return ((denominator - numerator) * 100 / denominator).toFixed(tofixed);
	},
	actions: {
		changedRep(item) {
			this.set('tmpRc', item);
			this.set('businessinput.resourceConfigId', item.id);
		}
	}
});
