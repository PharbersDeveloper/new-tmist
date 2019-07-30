import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { htmlSafe } from "@ember/template"

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

	actions: {
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		},
		dealData( data, config ) {
			this._super( ...arguments )
			// do something with chart data and config
			// console.log( data )
			// console.log( config )
		}
	},
	// 需要请求的图表 config
	tmProductCircle0: {
		id: "circleproductcontainer0",
		height: 168,
		panels: A( [
			{
				name: "tmcircleproduct0",
				id: "tmcircleproduct0",
				color: ["#73ABFF", "#FFC400", "#57D9A3"],
				condition: {
					"_source": [
						"product",
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
										"rep": "all"
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
										"product": "all"
									}
								}
							]
						}
					}
				},
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
		] )
	},
	tmProductCircle1: {
		id: "circleproductcontainer1",
		height: 168,
		panels: A( [
			{
				name: "tmcircleproduct1",
				id: "tmcircleproduct1",
				condition: {
					"_source": [
						"product",
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
										"rep": "all"
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
										"product": "all"
									}
								}
							]
						}
					}
				},
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
		] )
	},
	tmProductBarLine0: {
		id: "tmProductBarLineContainer",
		height: 305,
		panels: A( [
			{
				id: "bartmProductBarLine0",
				condition: {
					"_source": [
						"date",
						"sales",
						"target",
						"targetRate",
						"product"
					],
					"query": {
						"bool": {
							"must": [
								{
									"match": {
										"product": "all"
									}
								},
								{
									"match": {
										"rep": "all"
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
										"date": "all"
									}
								}
							]
						}
					},
					"sort": [
						{ "date": "asc" }
					]
				},
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
						y: "sales"
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
						y: "target"
					}
				}, {
					type: "line",
					name: "指标达成率",
					yAxisIndex: 1,
					encode: {
						y: "targetRate"
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
	tmRepresentativeCircle0: {
		id: "representativeCircleContainer0",
		height: 168,
		panels: A( [
			{
				name: "tmcircleRepresentative0",
				id: "tmcirclerepresentative0",
				color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2", "#FF8F73", "#998DD9"],
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
	tmRepresentativeCircle1: {
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
	tmRepresentativeBarLine0: {
		id: "tmRepresentativeBarLineContainer",
		height: 305,
		panels: A( [
			{
				id: "bartmRepresentativeBarLine0",
				condition: {
					"_source": [
						"date",
						"sales",
						"target",
						"targetRate",
						"product",
						"rep"
					],
					"query": {
						"bool": {
							"must": [
								{
									"match": {
										"rep": "clockq"
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
										"date": "all"
									}
								}
							]
						}
					},
					"sort": [
						{ "date": "asc" }
					]
				},
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
						y: "sales"
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
						y: "target"
					}
				}, {
					type: "line",
					name: "指标达成率",
					yAxisIndex: 1,
					encode: {
						y: "targetRate"
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
	tmHospitalCircle0: {
		id: "hospitalCircleContainer0",
		height: 168,
		panels: A( [
			{
				name: "tmcircleHospital0",
				id: "tmcircleHospital0",
				color: ["#73ABFF", "#FFC400", "#57D9A3", "#79E2F2", "#FF8F73", "#998DD9"],
				condition: {
					"_source": [
						"hosp_level",
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
										"rep": "all"
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
										"hosp_level": "all"
									}
								}
							]
						}
					}
				},
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
	tmHospitalCircle1: {
		id: "circleHospitalContainer1",
		height: 168,
		panels: A( [
			{
				name: "tmcirclehospital1",
				id: "tmcirclehospital1",
				condition: {
					"_source": [
						"hosp_level",
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
										"rep": "all"
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
										"hosp_level": "all"
									}
								}
							]
						}
					}
				},
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
	tmHospitalBarLine0: {
		id: "tmHospitalBarLineContainer",
		height: 305,
		panels: A( [
			{
				id: "bartmHospitalBarLine0",
				condition: {
					"_source": [
						"date",
						"sales",
						"target",
						"targetRate",
						"product",
						"hosp_name"
					],
					"query": {
						"bool": {
							"must": [
								{
									"match": {
										"hosp_name": "北京协和医院"
									}
								},
								{
									"match": {
										"product": "all"
									}
								},
								{
									"match": {
										"rep": "all"
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
								}
							],
							"must_not": [
								{
									"match": {
										"date": "all"
									}
								}
							]
						}
					}
				},
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
						y: "sales"
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
						y: "target"
					}
				}, {
					type: "line",
					name: "指标达成率",
					yAxisIndex: 1,
					encode: {
						y: "targetRate"
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
	}
} )
