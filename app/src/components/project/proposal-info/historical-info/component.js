import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { htmlSafe } from "@ember/template"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"

export default Component.extend( GenerateCondition,GenerateChartConfig, {
	positionalParams: ["periods", "resources", "products", "hospitals"],
	salesGroupValue: 0,
	classNames: ["report-wrapper"],
	// period: A([
	// 	{
	// 		name: "2019 第一季度"
	// 	},
	// 	{
	// 		name: "2019 第二季度"
	// 	}
	// ]),
	regions: A( [{name:"会东市",id: 1},{name:"会南市",id:2},{name:"会西市",id:3}] ),
	seasonQ( seasonText ) {
		let season = isEmpty( seasonText ) ? "" : seasonText

		if ( season === "" ) {
			return season
		}
		season = season.replace( "第一季度", "Q1" )
		season = season.replace( "第二季度", "Q2" )
		season = season.replace( "第三季度", "Q3" )
		season = season.replace( "第四季度", "Q4" )

		return season
	},

	tableHead: computed( "periods", function () {
		window.console.log( this.periods )
		if ( this.periods == undefined ) {
			return
		}
		let seasonQ = "",
			tableHead = A( [] ),
			tmpHead = this.periods.map( ele => {
				let name = ele.name

				return name.slice( 0, 4 ) + name.slice( -4 )
			} )

		seasonQ = this.seasonQ( tmpHead.lastObject )
		tableHead.push( htmlSafe( `销售增长率<br>${seasonQ}` ) )
		tableHead.push( htmlSafe( `指标达成率<br>${seasonQ}` ) )
		tmpHead.forEach( ele => {
			seasonQ = this.seasonQ( ele )
			tableHead.push( htmlSafe( `销售额<br>${seasonQ}` ) )
		} )
		tmpHead.forEach( ele => {
			seasonQ = this.seasonQ( ele )
			tableHead.push( htmlSafe( `销售指标<br>${seasonQ}` ) )
		} )

		return tableHead
	} ),
	/**
	 * @author Frank Wang
	 * @method
	 * @name dealData
	 * @description 创建饼图的图例数据
	 * @param data 组件中请求回的数据
	 * @param config 图表组件中的配置信息
	 * @return {void}
	 * @example 创建例子。
	 * @private
	 */
	dealData( data, config, name,property ) {
		// this._super( ...arguments )
		// do something with chart data and config
		// example
		let products = data.slice( 1 ),
			color = config.color,
			productsData = products.map( ( ele, index ) => {
				let productInfo = {},
					titleArray = data[0],
					len = titleArray.length

				for ( let i = 0; i < len; i++ ) {
					productInfo[titleArray[i]] = ele[i]
				}
				productInfo.color = htmlSafe( `background-color:${color[index]}` )
				productInfo.name = productInfo[ `${name}.keyword`]
				productInfo.salesRate = productInfo["rate(sum(sales))"]
				productInfo.sales = productInfo["sum(sales)"]

				return productInfo
			} )

		this.set( property, productsData )
	},
	actions: {
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		},
		dealProd0Data( data, config ) {
			this.dealData( data,config,"product","product0Legend" )
		},
		dealProd1Data( data, config ) {
			this.dealData( data,config,"product","product1Legend" )
		},
		chooseProd( prod ) {
			let salesGroupValue = this.salesGroupValue

			if ( salesGroupValue === 0 ) {
				this.set( "tmpPsr",prod )
				this.set( "tmProductBarLineCondition", this.generateProdBarLineCondition( prod.name ) )
			} else if ( salesGroupValue === 1 ) {
				this.set( "tmpProdRep",prod )
				this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( this.tmpRep.name, prod.name ) )
			} else if ( salesGroupValue === 2 ) {
				this.set( "tmpProdHosp",prod )
				this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( this.tmpHosp.name, prod.name ) )
			} else if ( salesGroupValue === 3 ) {
				this.set( "tmpProdReg",prod )
				this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( this.tmpReg.name, prod.name ) )
			}
		},
		chooseRep( rep ) {
			let prodName = this.tmpProdRep && this.tmpProdRep.name

			this.set( "tmpRep",rep )
			this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( rep.name,prodName ) )
		},
		chooseHosp( hosp ) {
			let prodName = this.tmpProdHosp && this.tmpProdHosp.name

			this.set( "tmpHosp",hosp )
			this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( hosp.name,prodName ) )
		},
		chooseReg( reg ) {
			let prodName = this.tmpProdReg && this.tmpProdReg.name

			this.set( "tmpReg",reg )
			this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( reg.name,prodName ) )
		},
		dealRep0Data( data,config ) {
			this.dealData( data,config,"representative","rep0Legend" )
		},
		dealRep1Data( data,config ) {
			this.dealData( data,config,"representative","rep1Legend" )
		},
		dealHosp0Data( data,config ) {
			this.dealData( data,config,"hospital_level","Hosp0Legend" )
		},
		dealHosp1Data( data,config ) {
			this.dealData( data,config,"hospital_level","Hosp1Legend" )
		},
		dealReg0Data( data,config ) {
			this.dealData( data,config,"region","Reg0Legend" )
		},
		dealReg1Data( data,config ) {
			this.dealData( data,config,"region","Reg1Legend" )
		}
	},
	init() {
		this._super( ...arguments )

		const that = this

		let defaultRep = this.resources.firstObject,
			defaultHosp = this.hospitals.firstObject

		this.set( "tmpRep",defaultRep )
		this.set( "tmpHosp",defaultHosp )

		new Promise( function ( resolve ) {
			// later( function () {
			let tmProductCircle0 = that.generateCircleChart( "circleproductcontainer0","tmcircleproduct0" ),
				tmProductCircle1 = that.generateCircleChart( "circleproductcontainer1","tmcircleproduct1" ),
				tmProductCircleCondition = that.generateProductCircleCondition( -1 ),
				tmProductBarLine0 = that.generateBarLineConfig( "tmProductBarLineContainer","bartmProductBarLine0" ),
				tmProductBarLineCondition = that.generateProdBarLineCondition(),
				tmRepCircle0 = that.generateCircleChart( "representativeCircleContainer0","tmcircleRepresentative0" ),
				tmRepCircle1 = that.generateCircleChart( "circleRepresentativeContainer1","tmcirclerepresentative1" ),
				tmRepCircleCondition = that.generateRepCircleCondition( -1 ),
				tmRepBarLine0 = that.generateBarLineConfig( "tmRepresentativeBarLineContainer","bartmRepresentativeBarLine0" ),
				tmRepBarLineCondition = that.generateRepBarLineCondition( defaultRep.name ),
				tmHosCircle0 = that.generateCircleChart( "hospitalCircleContainer0","tmcircleHospital0" ),
				tmHosCircle1 = that.generateCircleChart( "hospitalCircleContainer1","tmcircleHospital1" ),
				tmHosCircleCondition = that.generateHospCircleCondition( -1 ),
				tmHosBarLine0 = that.generateBarLineConfig( "tmHospitalBarLineContainer","bartmHospitalBarLine0" ),
				tmHosBarLineCondition = that.generateHospBarLineCondition( defaultHosp.name ),
				tmRegCircle0 = that.generateCircleChart( "regionCircleContainer0","tmcircleregion0" ),
				tmRegCircle1 = that.generateCircleChart( "regionCircleContainer1","tmcircleregion1" ),
				tmRegCircleCondition = that.generateRegionCircleCondition( -1 ),
				tmRegBarLine0 = that.generateBarLineConfig( "tmRegionBarLineContainer","bartmRegionBarLine0" ),
				tmRegBarLineCondition = that.generateRegionBarLineCondition() // 查询区域全部总值&&产品全部总值

			resolve( {
				tmProductCircle0, tmProductCircle1, tmProductCircleCondition, tmProductBarLine0, tmProductBarLineCondition,
				tmRepCircle0, tmRepCircle1, tmRepCircleCondition, tmRepBarLine0, tmRepBarLineCondition,
				tmHosCircle0, tmHosCircle1, tmHosCircleCondition, tmHosBarLine0, tmHosBarLineCondition,
				tmRegCircle0, tmRegCircle1, tmRegCircleCondition, tmRegBarLine0, tmRegBarLineCondition

			} )
			// }, 400 )
		} ).then( data => {
			this.set( "tmProductCircle0", data.tmProductCircle0 )
			this.set( "tmProductCircleCondition", data.tmProductCircleCondition )
			this.set( "tmProductCircle1", data.tmProductCircle1 )
			this.set( "tmProductBarLine0", data.tmProductBarLine0 )
			this.set( "tmProductBarLineCondition", data.tmProductBarLineCondition )
			this.set( "tmRepCircle0", data.tmRepCircle0 )
			this.set( "tmRepCircle1", data.tmRepCircle1 )
			this.set( "tmRepCircleCondition", data.tmRepCircleCondition )
			this.set( "tmRepBarLine0", data.tmRepBarLine0 )
			this.set( "tmRepBarLineCondition", data.tmRepBarLineCondition )
			this.set( "tmHosCircle0", data.tmHosCircle0 )
			this.set( "tmHosCircle1", data.tmHosCircle1 )
			this.set( "tmHosCircleCondition", data.tmHosCircleCondition )
			this.set( "tmHosBarLine0", data.tmHosBarLine0 )
			this.set( "tmHosBarLineCondition", data.tmHosBarLineCondition )
			this.set( "tmRegCircle0", data.tmRegCircle0 )
			this.set( "tmRegCircle1", data.tmRegCircle1 )
			this.set( "tmRegCircleCondition", data.tmRegCircleCondition )
			this.set( "tmRegBarLine0", data.tmRegBarLine0 )
			this.set( "tmRegBarLineCondition", data.tmRegBarLineCondition )
		} )
	}
} )

