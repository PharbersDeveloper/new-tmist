import DS from 'ember-data';

export default DS.Model.extend({
	potential: DS.attr('number'),
	sales: DS.attr('number'),
	salesQuota: DS.attr('number'),
	destConfig: DS.belongsTo('destConfig'),
	goodsConfig: DS.belongsTo('goodsConfig')
});
