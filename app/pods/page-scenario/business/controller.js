import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	// 设置一些默认值
	indicatorValue: 0,
	budgetValue: 0,
	meetingValue: 0,
	total: computed('businessInputs.@each.{salesTarget,budget,meetingPlaces}', function () {
		let businessInputs = this.get('businessInputs'),
			usedSalesTarget = 0,
			usedBudget = 0,
			usedMeetingPlaces = 0;

		businessInputs.forEach(bi => {
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
		this.set('hospitalState', [
			{ name: '全部', state: 0 },
			{ name: '未分配', state: 1 }
		]);
	},

	actions: {
		goToHospital(id) {
			this.transitionToRoute('page-scenario.business.hospital-config', id);
		}
	}
});
