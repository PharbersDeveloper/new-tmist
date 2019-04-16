import DS from 'ember-data';

export default DS.Model.extend({
	scenarioId: DS.attr('string'),
	accessStatus: DS.attr('string'),
	destConfig: DS.belongsTo('destConfig'),
	goodsConfig: DS.belongsTo('goodsConfig'),
	salesReport: DS.belongsTo('salesReport')
});
