import DS from 'ember-data';

export default DS.Model.extend({
	population: DS.attr('number'),
	healthSpending: DS.attr('number'),
	destConfig: DS.belongsTo('destConfig'),
	region: DS.belongsTo('region')
});
