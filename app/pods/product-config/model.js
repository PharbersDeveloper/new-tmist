import DS from 'ember-data';

export default DS.Model.extend({
	productType: DS.attr('string'),
	priceType: DS.attr('string'),
	lifeCycle: DS.attr('string'),
	launchTime: DS.attr('number'),
	productCategory: DS.attr('string'),
	treatmentArea: DS.attr('string'),
	productFeature: DS.attr('string'),
	referencePrice: DS.attr('number'),
	costPrice: DS.attr('number'),
	costEffective: DS.attr('string'),
	safety: DS.attr('string'),
	effectiveness: DS.attr('string'),
	convenience: DS.attr('string'),
	targetDepartment: DS.attr('string'),
	goodsConfig: DS.belongsTo('goodsConfig'),
	product: DS.belongsTo('product')
});
