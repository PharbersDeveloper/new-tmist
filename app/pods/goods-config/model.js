import DS from 'ember-data';

export default DS.Model.extend({
	scenarioId: DS.attr('string'),
	goodsType: DS.attr('number'),
	goodsId: DS.attr('string'),
	productConfig: DS.belongsTo('productConfig')
});
