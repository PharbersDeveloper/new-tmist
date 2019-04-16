import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Controller.extend({
	// 设置一些默认值
	indicatorValue: 0,
	budgetValue: 0,
	meetingValue: 0,
	hospitalState: A([
		{ name: '全部', state: 0 },
		{ name: '待分配', state: 1 },
		{ name: '已分配', state: 2 }

	]),
	overallFilterData: computed('currentHospState.state', function () {
		let currentHospState = this.get('currentHospState').state,
			destConfigs = this.get('model').destConfigs,
			businessInputs = this.get('businessInputs'),
			tmpDestConfigs = A([]);

		if (currentHospState) {
			let tmpBis = businessInputs.filterBy('isFinish', currentHospState !== 1);

			tmpBis.forEach(ele => {
				destConfigs.forEach(item => {
					if (ele.get('destConfigId') === item.id) {
						tmpDestConfigs.push(item);
					}
				});
			});
			return tmpDestConfigs;
		}
		return destConfigs;
	}),
	total: computed('businessInputs.@each.{salesTarget,budget,meetingPlaces}', function () {
		let businessInputs = this.get('businessInputs'),
			newBusinessInputs = businessInputs.filter(ele => ele.get('isNew')),
			usedSalesTarget = 0,
			usedBudget = 0,
			usedMeetingPlaces = 0;

		newBusinessInputs.forEach(bi => {
			usedSalesTarget += Number(bi.get('salesTarget'));
			usedBudget += Number(bi.get('budget'));
			usedMeetingPlaces += Number(bi.get('meetingPlaces'));
		});

		return {
			usedSalesTarget,
			usedBudget,
			usedMeetingPlaces
		};
	}),
	init() {
		this._super(...arguments);
		this.set('currentHospState', {
			name: '全部', state: 0
		});
	},
	actions: {
		goToHospital(id) {
			this.transitionToRoute('page-scenario.business.hospital-config', id);
		}
	}
});
