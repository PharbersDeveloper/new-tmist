import DS from 'ember-data';

export default DS.Model.extend({
	destConfigId: DS.attr('string'),
	resourceConfigId: DS.attr('string'),
	salesTarget: DS.attr('number'),
	budget: DS.attr('number'),
	meetingPlaces: DS.attr('number'),
	visitTime: DS.attr('number')
});
