import DS from 'ember-data';

export default DS.Model.extend({
	scenarioId: DS.attr('string'),
	businessExperience: DS.attr('string'),
	describe: DS.attr('string')
});
