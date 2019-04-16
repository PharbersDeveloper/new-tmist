import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	proposalId: DS.attr('string'),
	phase: DS.attr('number')
});
