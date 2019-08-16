import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { htmlSafe } from "@ember/template"
import { later } from "@ember/runloop"
import GenerateCondition from "new-tmist/mixins/generate-condition"

export default Component.extend( GenerateCondition, {
	positionalParams: ["periods"],
	salesGroupValue: 0,
	classNames: ["report-wrapper"],
	// TODO; 产品应该传入来
	products: A( [
		{productName: "美素",id: 1},
		{productName: "普纳林",id: 2},
		{productName: "西泰来",id:3}

	] ),
	representatives: A( [
		{name: "小兰",id: 1},
		{name: "小宋",id: 2},
		{name: "小木",id: 3}
	] ),
	hospitals: A( [
		{name: "中日医院",id: 1},
		{name: "人民医院",id: 2},
		{name: "光华医院",id: 3}
	] ),
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
			// this._super( ...arguments )
			// do something with chart data and config
			// example
			this.dealData( data,config,"product","product0Legend" )
		},
		dealProd1Data( data, config ) {
			// this._super( ...arguments )
			// do something with chart data and config
			// example
			this.dealData( data,config,"product","product1Legend" )
		},
		chooseProd( prod ) {
			let salesGroupValue = this.salesGroupValue

			if ( salesGroupValue === 0 ) {
				this.set( "tmpPsr",prod )
				this.set( "tmProductBarLineCondition", this.generateProdBarLineCondition( prod.productName ) )
			} else if ( salesGroupValue === 1 ) {
				this.set( "tmpProdRep",prod )
				this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( this.tmpRep.name, prod.productName ) )
			} else if ( salesGroupValue === 2 ) {
				this.set( "tmpProdHosp",prod )
				this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( this.tmpHosp.name, prod.productName ) )
			}
		},

		chooseRep( rep ) {
			let prodName = this.tmpProdRep && this.tmpProdRep.productName

			this.set( "tmpRep",rep )
			this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( rep.name,prodName ) )
		},
		chooseHosp( hosp ) {
			let prodName = this.tmpProdHosp && this.tmpProdHosp.productName

			this.set( "tmpHosp",hosp )
			this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( hosp.name,prodName ) )
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
			this.dealData( data,config,"hospital","Reg0Legend" )
		},
		dealReg1Data( data,config ) {
			this.dealData( data,config,"hospital","Reg1Legend" )
		}
	},
	init() {
		this._super( ...arguments )

		this.set( "tmpRep",this.representatives.firstObject )
		this.set( "tmpHosp",this.hospitals.firstObject )

		const that = this

		new Promise( function ( resolve ) {
			later( function () {
				let tmProductCircle0 = {
						id: "circleproductcontainer0",
						height: 168,
						panels: [
							{
								name: "tmcircleproduct0",
								id: "tmcircleproduct0",
								color: ["#73ABFF", "#FFC400", "#57D9A3"],

								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["50", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}
								}]
							}
						]
					},
					tmProductCircle1 = {
						id: "circleproductcontainer1",
						height: 168,
						panels: [
							{
								name: "tmcircleproduct1",
								id: "tmcircleproduct1",
								color: ["#73ABFF", "#FFC400", "#57D9A3"],
								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["50", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}

								}]
							}
						]
					},
					tmProductCircleCondition = that.generateProductCircleCondition( -1 ),

					tmProductBarLine0 = {
						id: "tmProductBarLineContainer",
						height: 305,
						panels: A( [
							{
								id: "bartmProductBarLine0",
								color: ["#579AFF ", "#C2DAFF", "#FFAB00"],
								xAxis: {
									show: true,
									type: "category",
									name: "",
									axisTick: {
										show: true,
										alignWithLabel: true
									},
									axisLine: {
										show: true,
										lineStyle: {
											type: "dotted",
											color: "#DFE1E6"
										}
									},
									axisLabel: {
										show: true,
										color: "#7A869A",
										fontSize: 14,
										lineHeight: 20
									}
								},
								yAxis: [
									{
										type: "value",
										show: true,
										min: 0,
										axisLabel: {
											color: "#7A869A"
											// formatter: '¥ {value}'
										},
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLine: {
											show: false,
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									},
									{
										type: "value",
										name: "",
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLabel: {
											color: "#7A869A"
											// 		formatter: `{value}${rateUnit}`
										},
										axisLine: {
											show: false,
											type: "solid",
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: false,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									}
								],
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: { // 坐标轴指示器，坐标轴触发有效
										type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
									},
									backgroundColor: "rgba(9,30,66,0.54)"
								},
								legend: {
									icon: "circle",
									show: true,
									x: "center",
									y: "bottom",
									orient: "horizontal",
									textStyle: {
										fontSize: 14,
										color: "#7A869A"
									}
								},
								series: [{
									type: "bar",
									name: "销售额",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [1]
									}
								}, {
									type: "bar",
									name: "指标",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [2]
									}
								}, {
									type: "line",
									name: "指标达成率",
									yAxisIndex: 1,
									encode: {
										y: [3]
									},
									itemStyle: {
										normal: {
											label: {
												show: true,
												position: "top"
												// 			formatter: function (params) {
												// 				return `${params.value} ${rateUnit}`;
												// 			}
											}
										}
									}

								}]
							}
						] )
					},
					tmProductBarLineCondition = that.generateProdBarLineCondition( "美素" ),
					tmRepCircle0 = {
						id: "representativeCircleContainer0",
						height: 168,
						panels: A( [
							{
								name: "tmcircleRepresentative0",
								id: "tmcirclerepresentative0",
								color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2", "#FF8F73", "#998DD9"],

								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}
								}]
							}
						] )
					},
					tmRepCircle1 = {
						id: "circleRepresentativeContainer1",
						height: 168,
						panels: A( [
							{
								name: "tmcirclerepresentative1",
								id: "tmcirclerepresentative1",
								condition: {
									"_source": [
										"rep",
										"sales",
										"date",
										"salesRate"
									],
									"query": {
										"bool": {
											"must": [
												{
													"match": {
														"date": "2018Q1"
													}
												},
												{
													"match": {
														"product": "all"
													}
												},
												{
													"match": {
														"region": "all"
													}
												},
												{
													"match": {
														"hosp_level": "all"
													}
												},
												{
													"match": {
														"hosp_name": "all"
													}
												}
											],
											"must_not": [
												{
													"match": {
														"rep": "all"
													}
												}
											]
										}
									},
									"sort": [
										{ "rep": "asc" }
									]
								},
								color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2", "#FF8F73", "#998DD9"],
								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}

								}]
							}
						] )
					},
					tmRepCircleCondition = that.generateRepCircleCondition( -1 ),
					tmRepBarLine0 = {
						id: "tmRepresentativeBarLineContainer",
						height: 305,
						panels: A( [
							{
								id: "bartmRepresentativeBarLine0",

								color: ["#579AFF ", "#C2DAFF", "#FFAB00"],
								xAxis: {
									show: true,
									type: "category",
									name: "",
									axisTick: {
										show: true,
										alignWithLabel: true
									},
									axisLine: {
										show: true,
										lineStyle: {
											type: "dotted",
											color: "#DFE1E6"
										}
									},
									axisLabel: {
										show: true,
										color: "#7A869A",
										fontSize: 14,
										lineHeight: 20
									}
								},
								yAxis: [
									{
										type: "value",
										show: true,
										min: 0,
										axisLabel: {
											color: "#7A869A"
											// formatter: '¥ {value}'
										},
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLine: {
											show: false,
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									},
									{
										type: "value",
										name: "",
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLabel: {
											color: "#7A869A"
											// 		formatter: `{value}${rateUnit}`
										},
										axisLine: {
											show: false,
											type: "solid",
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: false,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									}
								],
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: { // 坐标轴指示器，坐标轴触发有效
										type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
									},
									backgroundColor: "rgba(9,30,66,0.54)"
								},
								legend: {
									icon: "circle",
									show: true,
									x: "center",
									y: "bottom",
									orient: "horizontal",
									textStyle: {
										fontSize: 14,
										color: "#7A869A"
									}
								},
								series: [{
									type: "bar",
									name: "销售额",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [1]
									}
								}, {
									type: "bar",
									name: "指标",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [2]
									}
								}, {
									type: "line",
									name: "指标达成率",
									yAxisIndex: 1,
									encode: {
										y: [3]
									},
									itemStyle: {
										normal: {
											label: {
												show: true,
												position: "top"
												// 			formatter: function (params) {
												// 				return `${params.value} ${rateUnit}`;
												// 			}
											}
										}
									}

								}]
							}
						] )
					},
					tmRepBarLineCondition = that.generateRepBarLineCondition( "小兰" ),
					tmHosCircle0 = {
						id: "hospitalCircleContainer0",
						height: 168,
						panels: A( [
							{
								name: "tmcircleHospital0",
								id: "tmcircleHospital0",
								color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2", "#FF8F73", "#998DD9"],

								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}
								}]
							}
						] )
					},
					tmHosCircle1 = {
						id: "circleHospitalContainer1",
						height: 168,
						panels: A( [
							{
								name: "tmcirclehospital1",
								id: "tmcirclehospital1",
								color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2"],
								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}

								}]
							}
						] )
					},
					tmHosCircleCondition = that.generateHospCircleCondition( -1 ),
					tmHosBarLine0 = {
						id: "tmHospitalBarLineContainer",
						height: 305,
						panels: A( [
							{
								id: "bartmHospitalBarLine0",

								color: ["#579AFF ", "#C2DAFF", "#FFAB00"],
								xAxis: {
									show: true,
									type: "category",
									name: "",
									axisTick: {
										show: true,
										alignWithLabel: true
									},
									axisLine: {
										show: true,
										lineStyle: {
											type: "dotted",
											color: "#DFE1E6"
										}
									},
									axisLabel: {
										show: true,
										color: "#7A869A",
										fontSize: 14,
										lineHeight: 20
									}
								},
								yAxis: [
									{
										type: "value",
										show: true,
										min: 0,
										axisLabel: {
											color: "#7A869A"
											// formatter: '¥ {value}'
										},
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLine: {
											show: false,
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									},
									{
										type: "value",
										name: "",
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLabel: {
											color: "#7A869A"
											// 		formatter: `{value}${rateUnit}`
										},
										axisLine: {
											show: false,
											type: "solid",
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: false,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									}
								],
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: { // 坐标轴指示器，坐标轴触发有效
										type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
									},
									backgroundColor: "rgba(9,30,66,0.54)"
								},
								legend: {
									icon: "circle",
									show: true,
									x: "center",
									y: "bottom",
									orient: "horizontal",
									textStyle: {
										fontSize: 14,
										color: "#7A869A"
									}
								},
								series: [{
									type: "bar",
									name: "销售额",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [1]
									}
								}, {
									type: "bar",
									name: "指标",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [2]
									}
								}, {
									type: "line",
									name: "指标达成率",
									yAxisIndex: 1,
									encode: {
										y: [3]
									},
									itemStyle: {
										normal: {
											label: {
												show: true,
												position: "top"
											}
										}
									}

								}]
							}
						] )
					},
					tmHosBarLineCondition = that.generateHospBarLineCondition( "海港医院" ),
					tmRegCircle0 = {
						id: "regionCircleContainer0",
						height: 168,
						panels: A( [
							{
								name: "tmcircleregion0",
								id: "tmcircleregion0",
								color: ["#73ABFF", "#FFC400", "#57D9A3"],
								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}
								}]
							}
						] )
					},
					tmRegCircle1 = {
						id: "circleRegionContainer1",
						height: 168,
						panels: A( [
							{
								name: "tmcircleregion1",
								id: "tmcircleregion1",
								color: ["#73ABFF", "#FFC400", "#57D9A3"],
								tooltip: {
									show: true,
									trigger: "item"
								},
								legend: {
									show: false
								},
								series: [{
									name: "",
									type: "pie",
									radius: ["44", "64"],
									avoidLabelOverlap: false,
									hoverOffset: 3,
									labelLine: {
										normal: {
											show: true
										}
									},
									label: {
										color: "#7A869A",
										formatter: "{b}  {d}%"
									}

								}]
							}
						] )
					},
					tmRegCircleCondition = that.generateRegionCircleCondition( -1 ),


					tmRegBarLine0 = {
						id: "tmRegionBarLineContainer",
						height: 305,
						panels: A( [
							{
								id: "bartmRegionBarLine0",
								color: ["#579AFF ", "#C2DAFF", "#FFAB00"],
								xAxis: {
									show: true,
									type: "category",
									name: "",
									axisTick: {
										show: true,
										alignWithLabel: true
									},
									axisLine: {
										show: true,
										lineStyle: {
											type: "dotted",
											color: "#DFE1E6"
										}
									},
									axisLabel: {
										show: true,
										color: "#7A869A",
										fontSize: 14,
										lineHeight: 20
									}
								},
								yAxis: [
									{
										type: "value",
										show: true,
										min: 0,
										axisLabel: {
											color: "#7A869A"
											// formatter: '¥ {value}'
										},
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLine: {
											show: false,
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									},
									{
										type: "value",
										name: "",
										axisTick: {
											show: false,
											alignWithLabel: true
										},
										axisLabel: {
											color: "#7A869A"
											// 		formatter: `{value}${rateUnit}`
										},
										axisLine: {
											show: false,
											type: "solid",
											lineStyle: {
												type: "solid",
												color: "#EBECF0"
											}
										},
										splitLine: {
											show: false,
											lineStyle: {
												color: "#D2D4D9",
												width: 1,
												type: "dashed"
											}
										}
									}
								],
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: { // 坐标轴指示器，坐标轴触发有效
										type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
									},
									backgroundColor: "rgba(9,30,66,0.54)"
								},
								legend: {
									icon: "circle",
									show: true,
									x: "center",
									y: "bottom",
									orient: "horizontal",
									textStyle: {
										fontSize: 14,
										color: "#7A869A"
									}
								},
								series: [{
									type: "bar",
									name: "销售额",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [1]
									}
								}, {
									type: "bar",
									name: "指标",
									yAxisIndex: 0,
									barWidth: "12px",
									itemStyle: {
										barBorderRadius: [0, 0, 0, 0]
									},
									encode: {
										y: [2]
									}
								}, {
									type: "line",
									name: "指标达成率",
									yAxisIndex: 1,
									encode: {
										y: [3]
									},
									itemStyle: {
										normal: {
											label: {
												show: true,
												position: "top"
												// 			formatter: function (params) {
												// 				return `${params.value} ${rateUnit}`;
												// 			}
											}
										}
									}

								}]
							}
						] )
					},
					tmRegBarLineCondition = that.generateRegionBarLineCondition( "美素", "西河医院" )


				resolve( {
					tmProductCircle0, tmProductCircle1, tmProductCircleCondition, tmProductBarLine0, tmProductBarLineCondition,
					tmRepCircle0, tmRepCircle1, tmRepCircleCondition, tmRepBarLine0, tmRepBarLineCondition,
					tmHosCircle0, tmHosCircle1, tmHosCircleCondition, tmHosBarLine0, tmHosBarLineCondition,
					tmRegCircle0, tmRegCircle1, tmRegCircleCondition, tmRegBarLine0, tmRegBarLineCondition

				} )
			}, 400 )
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
