import DS from 'ember-data';

export default DS.Model.extend({
	sales: DS.attr('number'),
	salesQuota: DS.attr('number'),
	productName: DS.attr('string')
});
