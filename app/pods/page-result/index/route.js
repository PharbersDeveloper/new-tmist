import Route from '@ember/routing/route';
import rsvp from 'rsvp';
import { A } from '@ember/array';

export default Route.extend({
	generateTableBody(seasonData) {
		let totalData = A([]),
			ratesData = A([]),
			reportsLength = 0,
			tmpTableBody = A([]);

		seasonData.forEach((item, i) => {
			// 当前季度下的 one -> many **SalesReports()
			reportsLength = item.get('length');
			tmpTableBody = item.map(ele => {
				totalData.push(
					[ele.get('sales'), ele.get('salesQuota')]);
				if (seasonData.length - 1 === i) {
					ratesData.push(
						[
							(ele.get('salesGrowth') * 100).toFixed(0) + '%',
							(ele.get('quotaAchievement') * 100).toFixed(0) + '%'
						]);
				}

				return {
					goodsConfig: ele.get('goodsConfig'),
					resourceConfig: ele.get('resourceConfig'),
					destConfig: ele.get('destConfig'),
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
			tmpTableTr.push(ratesData[index]);
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
			indexModel = this.modelFor('index'),
			paperId = indexModel.detailPaper.id,
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
		return store.findRecord('paper', paperId)
			.then(data => {
				return data.get('salesReports');
			}).then(data => {
				let promiseArray = A([]);

				increaseSalesReports = data.sortBy('time');

				promiseArray = increaseSalesReports.map(ele => {
					return ele.get('scenario');
				});
				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				let promiseArray = A([]);

				tmpHead = data.map(ele => {
					let name = ele.get('name');

					return name.slice(0, 4) + name.slice(-4);
				});
				tmpHead.forEach(ele => {
					tableHead.push(ele + `\n销售额`);
				});
				tmpHead.forEach(ele => {
					tableHead.push(ele + '\n销售指标');
				});
				tableHead.push(`销售增长率\n${tmpHead.lastObject}`);
				tableHead.push(`指标达成率\n${tmpHead.lastObject}`);
				promiseArray = this.generatePromiseArray(increaseSalesReports, 'productSalesReports');
				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				// data 代表两个时期
				productSalesReports = data[0];

				prodTableBody = this.generateTableBody(data);

				return null;
			}).then(() => {
				//	获取代表销售报告
				let promiseArray = this.generatePromiseArray(increaseSalesReports, 'representativeSalesReports');

				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				//	拼接代表销售报告
				representativeSalesReports = data[0];

				repTableBody = this.generateTableBody(data);
				return null;
			}).then(() => {
				//	获取医院销售报告
				let promiseArray = this.generatePromiseArray(increaseSalesReports, 'hospitalSalesReports');

				return rsvp.Promise.all(promiseArray);
			}).then(data => {
				//	拼接医院销售报告
				hospitalSalesReports = data[0];

				hospTableBody = this.generateTableBody(data);
				return null;
			})
			.then(() => {
				return rsvp.hash({
					// 任一周期下的产品是相同的
					productSalesReports,
					representativeSalesReports,
					hospitalSalesReports,
					tableHead,
					prodTableBody,
					repTableBody,
					hospTableBody
				});
			});
	}
});
