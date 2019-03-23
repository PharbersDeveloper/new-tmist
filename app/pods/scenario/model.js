import DS from 'ember-data';

export default DS.Model.extend({
	proposalId: DS.attr('string'),
	phase: DS.attr('number')
});
