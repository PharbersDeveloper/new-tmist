import Route from '@ember/routing/route';
import RSVP, { hash } from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	model() {
		let totalConfig = this.modelFor('page-scenario.reference'),
			paper = totalConfig.paper,
			seasons = A([]),
			tmpData = A([]),
			destConfigs = totalConfig.destConfigs;

		return paper.get('salesReports')
			.then(data => {
				// 获取hospitalSalesReport
				let increaseSalesReports = data.sortBy('time'),
					promiseArray = increaseSalesReports.map(ele => {
						return ele.get('hospitalSalesReports');
					});

				seasons = increaseSalesReports.map(ele => {
					return ele.get('scenario');
				});
				return hash({
					hospitalSalesReports: RSVP.Promise.all(promiseArray),
					seasons: RSVP.Promise.all(seasons)
				});

			}).then(result => {
				let promiseArray = A([]),
					data = result.hospitalSalesReports;

				seasons = result.seasons.map(ele => ele.name);

				// 获取基于周期的数据
				tmpData = data.map((hospitalSalesReports, index) => {
					let productNames = this.eachArray(hospitalSalesReports, 'productName'),
						sales = this.eachArray(hospitalSalesReports, 'sales'),
						salesQuotas = this.eachArray(hospitalSalesReports, 'salesQuota'),
						quotaAchievement = this.eachArray(hospitalSalesReports, 'quotaAchievement'),
						destConfigIds = this.eachArray(hospitalSalesReports, 'destConfig');

					promiseArray = destConfigIds;

					return {
						productNames,
						date: seasons[index],
						sales,
						salesQuotas,
						quotaAchievement,
						destConfigIds
					};
				});
				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				let promiseArray = data.map(ele => ele.hospitalConfig);

				return RSVP.Promise.all(promiseArray);

			}).then(data => {
				let promiseArray = data.map(ele => ele.hospital);

				return RSVP.Promise.all(promiseArray);
			}).then(data => {
				let result = A([]);

				result = data.map((dc, index) => {

					return {
						hospitalId: dc.id,
						name: tmpData[0].productNames[index],
						date: seasons,
						sales: tmpData.map(ele => ele.sales[index]),
						salesQuotas: tmpData.map(ele => ele.salesQuotas[index]),
						quotaAchievementes: tmpData.map(ele => ele.quotaAchievement[index] * 100)
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

				return result;
			}).then(data => {

				return hash({
					barDatum: data,
					goodsConfigs: totalConfig.goodsConfigs,
					salesConfigs: totalConfig.salesConfigs,
					destConfigs
				});
			});
	},
	eachArray(array, key) {
		return array.map(ele => {
			return ele.get(key);
		});
	}
});
