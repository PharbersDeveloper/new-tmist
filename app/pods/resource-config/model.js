import DS from 'ember-data';

export default DS.Model.extend({
	scenarioId: DS.attr('string'),
	resourceType: DS.attr('number'),
	resourceId: DS.attr('string'),
	managerConfig: DS.belongsTo('managerConfig'),
	representativeConfig: DS.belongsTo('representativeConfig')
});
