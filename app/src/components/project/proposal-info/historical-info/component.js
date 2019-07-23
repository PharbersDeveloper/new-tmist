import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
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
	tableHead: computed( "periods", function () {
		let seasonQ = '',
			tableHead = A([]),
			tmpHead = this.periods.map(ele => {
			let name = ele.get('name')

			return name.slice(0, 4) + name.slice(-4)
		})
		seasonQ = this.seasonQ(tmpHead.lastObject);
		tableHead.push(htmlSafe(`销售增长率<br>${seasonQ}`))
		tableHead.push(htmlSafe(`指标达成率<br>${seasonQ}`))
		tmpHead.forEach(ele => {
			seasonQ = this.seasonQ(ele);
			tableHead.push(htmlSafe(`销售额<br>${seasonQ}`))
		})
		tmpHead.forEach(ele => {
			seasonQ = this.seasonQ(ele);
			tableHead.push(htmlSafe(`销售指标<br>${seasonQ}`))
		})
	} ),

	actions: {
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		}
	}
} )
