import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Controller.extend({
	// 设置一些默认值
	hospitalState: A([
		{ name: '全部', state: 0 },
		{ name: '待分配', state: 1 },
		{ name: '已分配', state: 2 }
	]),
	verify: service('service-verify'),
	representativesVisitPercent: computed('model.businessInputs.@each.{visitTime,resourceConfigId}', function () {
		const model = this.get('model');

		let resourceConfigs = model.resourceConfRep,
			result = A([]),
			businessInputs = model.businessInputs;

		result = resourceConfigs.map(ele => {

			let usedTime = 0,
				totalTime = ele.get('representativeConfig.totalTime');

			businessInputs.map(nbi => {
				if (ele.get('id') === nbi.get('resourceConfigId')) {
					usedTime += Number(nbi.get('visitTime'));
				}
			});
			return {
				id: ele.get('id'),
				resourceConfig: ele,
				totalTime,
				usedTime,
				restTime: 100 - usedTime
			};
		});

		return result;

	}),
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
	warning: computed('total.{overTotalBusinessIndicators,overTotalBudgets,overTotalMeetingPlaces,illegal,zeroVisitTime,blankMeetingPlaces}', function () {
		let { overTotalBusinessIndicators, overTotalBudgets,
				overTotalMeetingPlaces, overVisitTime, illegal, zeroVisitTime, blankMeetingPlaces } =
			this.get('total'),
			warning = { open: false, title: '', detail: '' };

		switch (true) {
		case illegal:
			warning.open = true;
			warning.title = '非法值警告';
			warning.detail = '请输入数字！';
			return warning;
		case zeroVisitTime.length > 0:
			warning.open = true;
			warning.title = '代表拜访时间不能为0';
			warning.detail = '代表拜访时间不能为0%，请合理分配。';
			return warning;
		case blankMeetingPlaces.length > 0:
			warning.open = true;
			warning.title = '会议总名额未填写';
			warning.detail = `请为“${blankMeetingPlaces.firstObject.destConfig.get('hospitalConfig.hospital.name')}”设定会议名额，若不分配，请输入值“0”`;
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
