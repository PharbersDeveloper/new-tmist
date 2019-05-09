import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
// import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Controller.extend({
	// 设置一些默认值
	hospitalState: A([
		{ name: '全部', state: 0 },
		{ name: '待分配', state: 1 },
		{ name: '已分配', state: 2 }
	]),
	verify: service('service-verify'),
	overallFilterData: computed('currentHospState.state', 'model.businessInputs.@each.isFinish', function () {
		let currentHospState = this.get('currentHospState').state,
			destConfigs = this.get('model').destConfigs,
			businessInputs = this.get('model.businessInputs'),
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
	warning: computed('total.{overTotalBusinessIndicators,overTotalBudgets,overTotalMeetingPlaces,illegal}', function () {
		let { overTotalBusinessIndicators, overTotalBudgets,
				overTotalMeetingPlaces, overVisitTime, illegal } =
			this.get('total'),
			warning = { open: false, title: '', detail: '' };

		switch (true) {
		case illegal:
			warning.open = true;
			warning.title = '非法值警告';
			warning.detail = '请输入数字！';
			return warning;
		case overTotalBusinessIndicators:
			warning.open = true;
			warning.title = '总业务指标超额';
			warning.detail = '您的销售额指标设定总值已超出业务总指标限制，请重新分配。';
			return warning;
		case overTotalBudgets:
			warning.open = true;
			warning.title = '总预算超额';
			warning.detail = '您的预算设定总值已超出总预算限制，请重新分配。';
			return warning;
		case overTotalMeetingPlaces:
			warning.open = true;
			warning.title = '会议总名额超额';
			warning.detail = '您的会议名额设定已超过总名额限制，请重新分配。';
			return warning;
		case overVisitTime.length > 0:
			warning.open = true;
			warning.title = '代表拜访时间超额';
			warning.detail = `该代表(${overVisitTime.firstObject.resourceConfig.get('representativeConfig.representative.name')})的拜访时间已超过总时间限制，请重新分配。`;
			return warning;
		default:
			return warning;
		}

	}),
	total: computed('model.businessInputs.@each.{resourceConfig,visitTime,salesTarget,budget,meetingPlaces}', function () {
		const verifyService = this.get('verify'),
			model = this.get('model'),
			resourceConfRep = model.resourceConfRep,
			businessInputs = model.businessInputs,
			resourceConfigManager = model.resourceConfManager;

		return verifyService.verifyInput(resourceConfRep, businessInputs, resourceConfigManager);
		// const model = this.get('model'),
		// 	resourceConfRep = model.resourceConfRep;

		// let newBusinessInputs = model.businessInputs,
		// 	representativeInputVisitTimes = A([]),
		// 	representativeVisitTimes = A([]),

		// 	usedSalesTarget = 0,
		// 	usedBudget = 0,
		// 	usedMeetingPlaces = 0,
		// 	usedVisitTime = 0,
		// 	numberVerify = this.get('numberVerify'),
		// 	totalBusinessIndicators = model.mConf.get('managerConfig.totalBusinessIndicators'),
		// 	totalBudgets = model.mConf.get('managerConfig.totalBudgets'),
		// 	totalMeetingPlaces = model.mConf.get('managerConfig.totalMeetingPlaces');

		// representativeInputVisitTimes = newBusinessInputs.map(bi => {
		// 	let choosedRep = isEmpty(bi.get('resourceConfig'));

		// 	usedSalesTarget += Number(bi.get('salesTarget'));
		// 	usedBudget += Number(bi.get('budget'));
		// 	usedMeetingPlaces += Number(bi.get('meetingPlaces'));
		// 	usedVisitTime += Number(bi.get('visitTime'));

		// 	return {
		// 		visitTime: Number(bi.get('visitTime')),
		// 		representativeId: choosedRep ? '' : bi.get('resourceConfig.representativeConfig.representative.id'),
		// 		resourceConfig: choosedRep ? null : bi.get('resourceConfig')
		// 	};
		// });

		// representativeVisitTimes = resourceConfRep.map(ele => {
		// 	let perVisitTime = 0;

		// 	representativeInputVisitTimes.forEach(item => {
		// 		if (item.representativeId === '') {
		// 			perVisitTime = 0;
		// 			return;
		// 		}
		// 		if (ele.get('representativeConfig.representative.id') === item.representativeId) {
		// 			perVisitTime += item.visitTime;
		// 		}
		// 	});
		// 	return {
		// 		visitTime: perVisitTime,
		// 		resourceConfig: ele
		// 	};
		// });
		// console.log(representativeVisitTimes);

		// return {
		// 	illegal: !numberVerify.test(usedSalesTarget) || !numberVerify.test(usedBudget) || !numberVerify.test(usedMeetingPlaces) || !numberVerify.test(usedVisitTime),
		// 	overTotalBusinessIndicators: usedSalesTarget > totalBusinessIndicators,
		// 	overTotalBudgets: usedBudget > totalBudgets,
		// 	overTotalMeetingPlaces: usedMeetingPlaces > totalMeetingPlaces,
		// 	overVisitTime: representativeVisitTimes.some(ele => ele.visitTime > 100),
		// 	usedSalesTarget,
		// 	usedBudget,
		// 	usedMeetingPlaces
		// };
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
