import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	time: DS.attr('number'),
	hospitalsalesreports: DS.hasMany('hospitalsalesreport'),
	productsalesreports: DS.hasMany('productsalesreport'),
	representativesalesreports: DS.hasMany('representativesalesreport'),
	formatTime: computed('time', function(){
		return '';
	})
});
