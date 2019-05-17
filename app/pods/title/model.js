import DS from 'ember-data';

export default DS.Model.extend({
	value: DS.attr('string'),
	describe: DS.attr('string'),
	image: DS.belongsTo()
});
