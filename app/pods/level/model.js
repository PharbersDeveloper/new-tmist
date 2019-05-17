import DS from 'ember-data';

export default DS.Model.extend({
	level: DS.attr('string'),
	code: DS.attr('number'),
	describe: DS.attr('string'),
	image: DS.belongsTo()
});
