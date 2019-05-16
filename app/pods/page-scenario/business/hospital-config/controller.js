import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	numberVerify: /^-?[1-9]\d*$/,
	IndicatorAllocationPercent: computed('businessinput.salesTarget', function () {
		let { totalBusinessIndicators, businessinput } =
			this.getProperties('totalBusinessIndicators', 'businessinput'),
			salesTarget = businessinput.get('salesTarget'),
			verify = this.numberVerify,
			illegal = verify.test(salesTarget);

		if (!illegal && salesTarget !== '') {
			return {
				illegal: true,
				percent: 0
			};
		}
		return {
			illegal: false,
			percent: isEmpty(totalBusinessIndicators) ? 0 : (salesTarget * 100 / totalBusinessIndicators).toFixed(2)
		};
	}),
	budgetPercent: computed('businessinput.budget', function () {
		let { totalBudgets, businessinput } =
			this.getProperties('totalBudgets', 'businessinput'),
			budget = businessinput.get('budget'),
			verify = this.numberVerify,
			illegal = verify.test(budget);

		if (!illegal && budget !== '') {
			return {
				illegal: true,
				percent: 0
			};
		}
		return {
			illegal: false,
			percent: isEmpty(totalBudgets) ? 0 : (budget * 100 / totalBudgets).toFixed(2)
		};
	}),
	// 代表分配时间percent
	representativesVisitPercent: computed('businessinput.visitTime', 'tmpRc', function () {
		let resourceConfigs = this.get('model').repConfs,
			result = A([]),
			newBusinessinputs = this.get('businessInputs');

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
			};
		});

		return result;

	}),

	actions: {
		changedRep(item) {
			let businessinput = this.get('businessinput');

			this.set('tmpRc', item);
			businessinput.setProperties({
				resourceConfigId: item.id,
				resourceConfig: item
			});
		},
		reInput() {
			let businessinput = this.get('businessinput');

			this.set('tmpRc', null);
			businessinput.setProperties({
				resourceConfigId: '',
				resourceConfig: null,
				visitTime: '',
				meetingPlaces: 0,
				salesTarget: '',
				budget: ''
			});
		}
	}
});
