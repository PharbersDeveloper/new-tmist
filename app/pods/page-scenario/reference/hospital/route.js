import Route from '@ember/routing/route';
import RSVP, { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference'),
			paper = totalConfig.paper,
			seasons = A([]);

		return paper.get('salesReports')
			.then(data => {
				// 获取hospitalSalesReport
				let increaseSalesReports = data.sortBy('time'),
					promiseArray = increaseSalesReports.map(ele => {
						return ele.get('hospitalSalesReports');
					});

				seasons = increaseSalesReports.map(ele => {
					return ele.get('formatTime');
				});
				return RSVP.Promise.all(promiseArray);

			}).then(data => {
				// 获取基于周期的数据
				let tmpData = data.map((hospitalSalesReports, index) => {
					let productNames = this.eachArray(hospitalSalesReports, 'productName'),
						sales = this.eachArray(hospitalSalesReports, 'sales'),
						salesQuotas = this.eachArray(hospitalSalesReports, 'salesQuota'),
						quotaAchievement = this.eachArray(hospitalSalesReports, 'salesQuota'),
						destConfig = this.eachArray(hospitalSalesReports, 'destConfig');

					return {
						productNames,
						date: seasons[index],
						sales,
						salesQuotas,
						quotaAchievement,
						destConfig
					};
				});

				return tmpData;
			}).then(data => {
				let tmpData = data[0].destConfig.map((dc, index) => {
					return {
						destConfigId: dc.get('id'),
						name: data[0].productNames[index],
						date: seasons,
						sales: data.map(ele => ele.sales[index]),
						salesQuotas: data.map(ele => ele.salesQuotas[index]),
						quotaAchievementes: data.map(ele => ele.quotaAchievement[index])
					};

				});

				// A([
				// 	{
				// 		name: '直接访问',
				// 		date: ['2018年第1季度', '2018年第2季度', '2018年第3季度', '2018年第4季度'],
				// 		sales: [10, 52, 200, 445],
				// 		targets: [555, 555, 555, 555],
				// 		rates: ['39%', '23%', '13%', '33%']
				// 	}
				// ])
				return tmpData;
			}).then(data => {

				return hash({
					barDatum: data,
					goodsConfigs: totalConfig.goodsConfigs,
					salesConfigs: totalConfig.salesConfigs,
					destConfigs: totalConfig.destConfigs
				});
			});
	},
	eachArray(array, key) {
		return array.map(ele => {
			return ele.get(key);
		});
	}
});
