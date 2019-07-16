import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	abilityCoach: DS.attr('blank-nan'),	// 1v1 能力辅导
	assistAccessTime: DS.attr('blank-nan'),	// 协访时间
	resourceConfigId: DS.attr('string'),
	productKnowledgeTraining: DS.attr('number'),	// 产品知识培训
	salesAbilityTraining: DS.attr('number'),	// 销售能力培训
	regionTraining: DS.attr('number'),	// 区域管理培训
	performanceTraining: DS.attr('number'),	// 绩效约谈
	vocationalDevelopment: DS.attr('number'),	// 职业发展指导
	teamMeeting: DS.attr('number'),
	totalPoint: computed('productKnowledgeTraining', 'salesAbilityTraining', 'regionTraining', 'performanceTraining', 'vocationalDevelopment', function () {
		let { productKnowledgeTraining, salesAbilityTraining,
			regionTraining, performanceTraining, vocationalDevelopment } =
			this.getProperties('productKnowledgeTraining', 'salesAbilityTraining', 'regionTraining', 'performanceTraining', 'vocationalDevelopment');

		return Number(productKnowledgeTraining) +
			Number(salesAbilityTraining) +
			Number(regionTraining) +
			Number(performanceTraining) +
			Number(vocationalDevelopment);
	}),
	resourceConfig: DS.belongsTo('resourceConfig')
});
