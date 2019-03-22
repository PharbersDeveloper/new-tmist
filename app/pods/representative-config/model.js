import DS from 'ember-data';

export default DS.Model.extend({
	age: DS.attr('number'),
	education: DS.attr('string'),
	professional: DS.attr('string'),
	experience: DS.attr('number'),
	productKnowledge: DS.attr('number'),
	salesAbility: DS.attr('number'),
	regionalManagementAbility: DS.attr('number'),
	jobEnthusiasm: DS.attr('number'),
	behaviorValidity: DS.attr('number'),
	representatives: DS.hasMany('representative'),
	resourceConfig: DS.belongsTo()
});
