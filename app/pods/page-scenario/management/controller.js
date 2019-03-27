import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Controller.extend({
	groupValue: 0,
	col: 'col',
	center: 'center',
	repConf: null,
	circleUsedTime: 0,
	circleRestTime: 1,
	circleTime: computed(`managerInput.totalManagerUsedTime`,
		`representativeInputs.@each.{assistAccessTime,abilityCoach}`,
		function () {
			let { managerInput, managerTotalTime, representativeInputs } =
				this.getProperties('managerInput', 'managerTotalTime',
					'representativeInputs'),
				usedTime = 0,
				restTime = 1;

			if (typeof managerTotalTime === 'undefined' || typeof representativeInputs === 'undefined') {
				return A([
					{ name: '已分配', value: usedTime },
					{ name: '未分配', value: restTime }
				]);
			}
			// usedTime = Number(managerInput.get('strategyAnalysisTime')) +
			//	Number(managerInput.get('adminWorkTime')) +	// 行政工作
			//	Number(managerInput.get('clientManagementTime')) +	// 重点目标客户管理
			//	Number(managerInput.get('kpiAnalysisTime')) +	// 代表及KPI分析
			//	Number(managerInput.get('teamMeetingTime'));	// 团队例会
			usedTime = managerInput.get('totalManagerUsedTime');
			representativeInputs.forEach(ele => {

				usedTime += Number(ele.get('assistAccessTime'));
				usedTime += Number(ele.get('abilityCoach'));
			});

			restTime = managerTotalTime - usedTime;
			return A([
				{ name: '已分配', value: usedTime },
				{ name: '未分配', value: restTime }
			]);
		}),
	circlePoint: computed(`representativeInputs.@each.{totalPoint}`, function () {
		let { managerTotalKpi, representativeInputs } =
			this.getProperties('managerTotalKpi', 'representativeInputs'),
			usedPoint = 0,
			restPoint = 1;

		if (typeof managerTotalKpi === 'undefined') {
			return A([
				{ name: '已分配', value: usedPoint },
				{ name: '未分配', value: restPoint }
			]);
		}

		representativeInputs.forEach(ele => {
			usedPoint += Number(ele.get('totalPoint'));
		});

		restPoint = managerTotalKpi - usedPoint;
		return A([
			{ name: '已分配', value: usedPoint },
			{ name: '未分配', value: restPoint }
		]);
	}),
	radarData: computed('repConf', function () {
		let repConf = this.get('repConf'),
			originalAbility = [],
			averageAbility = [5, 14, 28, 31, 42];

		if (repConf === null) {
			return [
				{
					value: [0, 0, 0, 0, 0],
					name: '代表本期初始能力'
				},
				{
					value: averageAbility,
					name: '团队平均能力*'
				}
			];
		}
		// value 按照此顺序
		// { name: '工作积极性', max: 100 },
		// { name: '产品知识', max: 100 },
		// { name: '行为有效性', max: 100 },
		// { name: '区域管理能力', max: 100 },
		// { name: '销售知识', max: 100 }
		originalAbility.push(repConf.get('jobEnthusiasm'));
		originalAbility.push(repConf.get('productKnowledge'));
		originalAbility.push(repConf.get('behaviorValidity'));
		originalAbility.push(repConf.get('regionalManagementAbility'));
		originalAbility.push(repConf.get('salesAbility'));
		return [
			{
				value: originalAbility,
				name: '代表本期初始能力'
			},
			{
				value: averageAbility,
				name: '团队平均能力*'
			}
		];
	})
});
