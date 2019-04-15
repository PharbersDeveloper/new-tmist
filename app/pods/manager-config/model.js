import DS from 'ember-data';

export default DS.Model.extend({
	managerKpi: DS.attr('number'),
	managerTime: DS.attr('number'),
	visitTotalTime: DS.attr('number'),
	totalBusinessIndicators: DS.attr('number'),
	totalBudgets: DS.attr('number'),
	totalMeetingPlaces: DS.attr('number'),
	teamBusinessExperience: DS.attr('string'),	// 团队业务经验
	teamDescribe: DS.attr('string')		// 团队描述
});
