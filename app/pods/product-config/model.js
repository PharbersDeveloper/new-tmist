import DS from 'ember-data';

export default DS.Model.extend({
	productType: DS.attr('string'),
	priceType: DS.attr('string'),
	price: DS.attr('number'),
	lifeCycle: DS.attr('string'),
	launchTime: DS.attr('number'),
	productCategory: DS.attr('string'),
	treatmentArea: DS.attr('string'),
	productFeature: DS.attr('string'),
	product: DS.belongsTo()
});
