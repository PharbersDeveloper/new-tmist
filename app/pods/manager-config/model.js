import DS from 'ember-data';

export default DS.Model.extend({
	managerKpi: DS.attr('number'),
	managerTime: DS.attr('number'),
	visitTotalTime: DS.attr('number'),
	resourceConfig: DS.belongsTo()
});
