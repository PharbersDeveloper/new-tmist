import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from '@ember/utils'
import { htmlSafe } from '@ember/template'

export default Component.extend( {
	positionalParams: ["periods"],
	salesGroupValue: 0,
	// init() {
	// 	this._super(...arguments);
	// 	// 初始化 全部选择 的一些数据
	// 	this.set('totalProduct', { id: 'totalProduct', productName: '全部选择' });
	// 	this.set('tmpPsr', this.get('totalProduct'));
	// 	this.set('totalRepresentatives', { id: 'totalRepresentatives', representativeName: '全部选择' });
	// 	this.set('tmpRsr', this.get('totalRepresentatives'));
	// 	this.set('totalHospitals', { id: 'totalHospitals', hospitalName: '全部选择' });
	// 	this.set('tmpHsr', this.get('totalHospitals'));
	// },
	// period: A([
	// 	{
	// 		name: "2019 第一季度"
	// 	},
	// 	{
	// 		name: "2019 第二季度"
	// 	}
	// ]),

	seasonQ(seasonText) {
		let season = isEmpty(seasonText) ? '' : seasonText;

		if (season === '') {
			return season;
		}
		season = season.replace('第一季度', 'Q1');
		season = season.replace('第二季度', 'Q2');
		season = season.replace('第三季度', 'Q3');
		season = season.replace('第四季度', 'Q4');

		return season;
	},

	tableHead: computed( "periods", function () {
		window.console.log(this.periods);
		if (this.periods == undefined) {
			return
		}
		let seasonQ = '',
			tableHead = A([]),
			tmpHead = this.periods.map(ele => {
			let name = ele.name

			return name.slice(0, 4) + name.slice(-4)
		})
		seasonQ = this.seasonQ(tmpHead.lastObject)
		tableHead.push(htmlSafe(`销售增长率<br>${seasonQ}`))
		tableHead.push(htmlSafe(`指标达成率<br>${seasonQ}`))
		tmpHead.forEach(ele => {
			seasonQ = this.seasonQ(ele);
			tableHead.push(htmlSafe(`销售额<br>${seasonQ}`))
		})
		tmpHead.forEach(ele => {
			seasonQ = this.seasonQ(ele)
			tableHead.push(htmlSafe(`销售指标<br>${seasonQ}`))
		})

		return tableHead
	} ),

	actions: {
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		}
	}
} )
