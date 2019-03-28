import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	IndicatorAllocationPercent: computed('businessinput.salesTarget', function () {
		let { totalBusinessIndicators, businessinput } =
			this.getProperties('totalBusinessIndicators', 'businessinput'),
			salesTarget = businessinput.get('salesTarget');

		if (salesTarget === 0 || typeof totalBusinessIndicators === 'undefined') {
			return 0;
		}
		return (salesTarget / totalBusinessIndicators).toFixed(2) * 100;

	}),
	budgetNumber: computed('businessinput.budget', function () {
		let { totalBudgets, businessinput } =
			this.getProperties('totalBudgets', 'businessinput'),
			budget = businessinput.get('budget');

		if (budget === 0 || typeof totalBudgets === 'undefined') {
			return 0;
		}
		return (budget / 100 * totalBudgets).toFixed(2);
	}),
	visitPercent: computed('businessinput.visitTime', function () {
		let { totalBudgets, businessinput } =
			this.getProperties('totalBudgets', 'businessinput'),
			budget = businessinput.get('budget');

		if (budget === 0 || typeof totalBudgets === 'undefined') {
			return 0;
		}
		return (budget / 100 * totalBudgets).toFixed(2);
	}),
	actions: {
		changedRep(item) {
			this.set('tmpRc', item);
			this.set('businessinput.resourceConfigId', item.id);
		}
	}
});
