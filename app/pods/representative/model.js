import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	gender: DS.attr('number'),
	representativeConfig: DS.belongsTo('representativeConfig'),
	images: DS.hasMany('image')
});
