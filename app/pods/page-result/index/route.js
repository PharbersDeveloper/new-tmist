import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	generateTableBody(seasonData, nameKey) {
		let totalData = A([]),
			reportsLength = 0,
			tmpTableBody = A([]);

		seasonData.forEach(item => {
			// 当前季度下的 one -> many **SalesReports()
			reportsLength = item.get('length');
			tmpTableBody = item.map(ele => {
				totalData.push(
					[ele.get('sales'), ele.get('salesQuota')]);
				return {
					name: ele.get(nameKey),
					productName: ele.get('productName'),
					potential: ele.get('potential')
				};
			});
		});
		tmpTableBody.map((ele, index) => {
			let seasonNum = totalData.length / reportsLength,
				tmpTableTr = [];

			for (let i = 1; i <= seasonNum; i++) {
				tmpTableTr.push(totalData[index + (i - 1) * reportsLength][0]);
			}
			for (let i = 1; i <= seasonNum; i++) {
				tmpTableTr.push(totalData[index + (i - 1) * reportsLength][1]);
			}
			ele.tableTr = tmpTableTr.flat();
			return ele;
		});
		return tmpTableBody;
	},
	generatePromiseArray(reports, key) {
		let promiseArray = A([]);

		promiseArray = reports.map(ele => {
			return ele.get(key);
		});
		return promiseArray;
	},
	model() {
		let store = this.get('store'),
			paper = store.findRecord('paper', '5c9b41d1421aa997100c2cb4'),
			salesReports = store.findRecord('paper', '5c9b41d1421aa997100c2cb4'),
			increaseSalesReports = A([]),
			tmpHead = A([]),
			productSalesReports = A([]),
			representativeSalesReports = A([]),
			hospitalSalesReports = A([]),
			tableHead = A([]),
			prodTableBody = A([]),
			repTableBody = A([]),
			hospTableBody = A([]);

		// 拼接 产品销售报告数据
		return paper.then(data => {
			return data.get('salesReports');
		}).then(data => {
			let promiseArray = A([]);

			increaseSalesReports = data.sortBy('time');

			tmpHead = increaseSalesReports.map(ele => {
				return ele.get('formatTime');
			});
			tmpHead.forEach(ele => {
				tableHead.push(ele + ' 销售额');
			});
			tmpHead.forEach(ele => {
				tableHead.push(ele + ' 销售指标');
			});

			promiseArray = this.generatePromiseArray(increaseSalesReports, 'productSalesReports');
			return rsvp.Promise.all(promiseArray);
		}).then(data => {
			// data 代表两个时期
			productSalesReports = data[0];

			prodTableBody = this.generateTableBody(data, 'productName');

			return null;
		}).then(() => {
			//	获取代表销售报告
			let promiseArray = this.generatePromiseArray(increaseSalesReports, 'representativeSalesReports');

			return rsvp.Promise.all(promiseArray);
		}).then(data => {
			//	拼接代表销售报告
			representativeSalesReports = data[0];

			repTableBody = this.generateTableBody(data, 'representativeName');
			return null;
		}).then(() => {
			//	获取医院销售报告
			let promiseArray = this.generatePromiseArray(increaseSalesReports, 'hospitalSalesReports');

			return rsvp.Promise.all(promiseArray);
		}).then(data => {
			//	拼接医院销售报告
			hospitalSalesReports = data[0];

			hospTableBody = this.generateTableBody(data, 'hospitalName');
			return null;
		})
			.then(() => {
				return rsvp.hash({
					// 任一周期下的产品是相同的
					productSalesReports,
					representativeSalesReports,
					hospitalSalesReports,
					salesReports,
					tableHead,
					prodTableBody,
					repTableBody,
					hospTableBody
				});
			});
	}
});
