import DS from 'ember-data';

export default DS.Model.extend({
	paperId: DS.attr('string'),
	scenario: DS.belongsTo(),
	phase: DS.attr('number'),
	time: DS.attr('formatDate'),
	businessinputs: DS.hasMany('businessinput'),
	managerinputs: DS.hasMany('managerinput'),
	representativeinputs: DS.hasMany('representativeinput')
});
