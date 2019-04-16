import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	time: DS.attr('number'),
	scenario: DS.belongsTo(),
	hospitalSalesReports: DS.hasMany('hospitalSalesReport'),
	productSalesReports: DS.hasMany('productSalesReport'),
	representativeSalesReports: DS.hasMany('representativeSalesReport'),
	formatTime: computed('time', function () {
		function quarter(month) {
			let q1 = /^[1-3]{1}$/.exec(month) === null ? null : 1,
				q2 = /^[4-6]{1}$/.exec(month) === null ? null : 2,
				q3 = /^[7-9]{1}$/.exec(month) === null ? null : 3,
				q4 = /^[10-12]{2}$/.exec(month) === null ? null : 4;

			return [q1, q2, q3, q4];
		}

		let time = new Date(this.get('time')),
			year = time.getFullYear(),
			month = time.getMonth() + 1;

		return `${year}年 第${quarter(month).filter(ele => ele !== null)[0]}季度`;
	})
});
