import DS from 'ember-data';

export default DS.Model.extend({
	accountId: DS.attr('string'),
	proposalId: DS.attr('string'),
	name: DS.attr('string'),
	describe: DS.attr('string'),
	startTime: DS.attr('number'),
	endTime: DS.attr('number'),
	state: DS.attr('number'),
	paperinputs: DS.hasMany('paperinput'),
	salesReports: DS.hasMany('salesReport'),
	personnelAssessments: DS.hasMany('personnelAssessment')
});
