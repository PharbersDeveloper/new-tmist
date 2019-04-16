import DS from 'ember-data';

export default DS.Model.extend({
	img: DS.attr('string'),
	tag: DS.attr('string'),
	flag: DS.attr('number')
});
