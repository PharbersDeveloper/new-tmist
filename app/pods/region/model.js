import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	describe: DS.attr('string'),
	regionConfig: DS.belongsTo(),
	images: DS.hasMany('image')
});
