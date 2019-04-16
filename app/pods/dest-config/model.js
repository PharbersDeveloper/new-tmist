import DS from 'ember-data';

export default DS.Model.extend({
	scenarioId: DS.attr('string'),
	destType: DS.attr('number'),
	destId: DS.attr('string'),
	hospitalConfig: DS.belongsTo('hospitalConfig'),
	regionConfig: DS.belongsTo('regionConfig')
});
