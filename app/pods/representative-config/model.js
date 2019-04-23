import DS from 'ember-data';

export default DS.Model.extend({
	age: DS.attr('number'),
	advantage: DS.attr('string'),
	managerEvaluation: DS.attr('string'),
	education: DS.attr('string'),
	professional: DS.attr('string'),
	experience: DS.attr('number'),
	productKnowledge: DS.attr('number'),
	salesAbility: DS.attr('number'),
	regionalManagementAbility: DS.attr('number'),
	jobEnthusiasm: DS.attr('number'),
	entryTime: DS.attr('number'),	// 入职时长
	behaviorValidity: DS.attr('number'),
	totalTime: DS.attr('number'),
	representative: DS.belongsTo()
});
