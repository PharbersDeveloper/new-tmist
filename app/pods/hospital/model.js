import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	describe: DS.attr('string'),
	code: DS.attr('string'),
	hospitalCategory: DS.attr('string'),
	hospitalLevel: DS.attr('string'),
	position: DS.attr('string'),
	images: DS.hasMany('image'),
	hospitalConfig: DS.belongsTo()
});
