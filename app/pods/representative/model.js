import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	gender: DS.attr('number'),
	representativeConfig: DS.belongsTo(),
	images: DS.hasMany('image')
});
