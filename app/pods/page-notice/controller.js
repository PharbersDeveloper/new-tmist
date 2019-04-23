import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
	usedResource: computed('model.paperinput', function () {
		if (isEmpty(this.model.paperinput)) {
			return {
				arrangedHospital: 0,
				arrangedRepresentative: 0,
				assignedBudgets: 0,
				assignedMedicines: 0
			};
		}
	}),
	// 只有为空的逻辑，若是继续部署，可以参照下面的获取方式
	circleTime: computed('model.paperinput', 'totalTime', function () {
		let paperinput = this.get('model.paperinput'),
			//	resourceConfigManager = this.get('model.resourceConfigManager'),
			totalTime = this.get('totalTime');

		if (isEmpty(paperinput)) {
			return A([
				{ name: '已分配', value: 0 },
				{ name: '未分配', value: totalTime }
			]);
		}

	}),
	//
	// circleTime: computed(`managerInput.totalManagerUsedTime`,
	// 	`representativeInputs.@each.{assistAccessTime,abilityCoach}`,
	// 	function () {
	// 		let { managerInput, managerTotalTime, representativeInputs } =
	// 			this.getProperties('managerInput', 'managerTotalTime',
	// 				'representativeInputs'),
	// 			usedTime = 0,
	// 			restTime = 1;

	// 		if (typeof managerTotalTime === 'undefined' || typeof representativeInputs === 'undefined') {
	// 			return A([
	// 				{ name: '已分配', value: usedTime },
	// 				{ name: '未分配', value: restTime }
	// 			]);
	// 		}
	// 		// usedTime = Number(managerInput.get('strategyAnalysisTime')) +
	// 		//	Number(managerInput.get('adminWorkTime')) +	// 行政工作
	// 		//	Number(managerInput.get('clientManagementTime')) +	// 重点目标客户管理
	// 		//	Number(managerInput.get('kpiAnalysisTime')) +	// 代表及KPI分析
	// 		//	Number(managerInput.get('teamMeetingTime'));	// 团队例会
	// 		usedTime = managerInput.get('totalManagerUsedTime');
	// 		representativeInputs.forEach(ele => {

	// 			usedTime += Number(ele.get('assistAccessTime'));
	// 			usedTime += Number(ele.get('abilityCoach'));
	// 		});

	// 		restTime = managerTotalTime - usedTime;
	// 		return A([
	// 			{ name: '已分配', value: usedTime },
	// 			{ name: '未分配', value: restTime }
	// 		]);
	// 	}),
	// 只有为空的逻辑，若是继续部署，可以参照下面的获取方式

	circlePoint: computed('model.input', 'totalKpi', function () {
		let paperinput = this.get('model.paperinput'),
			// resourceConfigManager = this.get('model.resourceConfigManager'),
			totalKpi = this.get('totalTime');

		if (isEmpty(paperinput)) {
			return A([
				{ name: '已分配', value: 0 },
				{ name: '未分配', value: totalKpi }
			]);
		}
	})
	// circlePoint: computed(`representativeInputs.@each.{totalPoint}`, function () {
	// 	let { managerTotalKpi, representativeInputs } =
	// 		this.getProperties('managerTotalKpi', 'representativeInputs'),
	// 		usedPoint = 0,
	// 		restPoint = 1;

	// 	if (typeof managerTotalKpi === 'undefined') {
	// 		return A([
	// 			{ name: '已分配', value: usedPoint },
	// 			{ name: '未分配', value: restPoint }
	// 		]);
	// 	}

	// 	representativeInputs.forEach(ele => {
	// 		usedPoint += Number(ele.get('totalPoint'));
	// 	});

	// 	restPoint = managerTotalKpi - usedPoint;
	// 	return A([
	// 		{ name: '已分配', value: usedPoint },
	// 		{ name: '未分配', value: restPoint }
	// 	]);
	// })
});
