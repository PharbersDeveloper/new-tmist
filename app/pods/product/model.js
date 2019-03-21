import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	generalName: DS.attr('string'),
	describe: DS.attr('string'),
	productCategory: DS.attr('string'),
	images: DS.hasMany('image')
});
