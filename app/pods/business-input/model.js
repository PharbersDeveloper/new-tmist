import DS from 'ember-data';

export default DS.Model.extend({
	hospitalId: DS.attr('string'),
	representativeId: DS.attr('string'),
	salesTarget: DS.attr('number'),
	budget: DS.attr('number'),
	meetingPlaces: DS.attr('number'),
	visitTime: DS.attr('number')
});
