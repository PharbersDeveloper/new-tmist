import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	groupValue: 0,
	col: 'col',
	center: 'center',
	repConf: null,
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
