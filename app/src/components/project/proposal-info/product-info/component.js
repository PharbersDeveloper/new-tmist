import Component from "@ember/component"
import { later } from "@ember/runloop"

export default Component.extend( {
	positionalParams: ["products"],
	currentProduct: 0,
	init() {
		this._super( ...arguments )

		new Promise( function ( resolve ) {
			later( function () {
				let tmProdsLines = {
						id: "tmProdsLinesContainer",
						height: 305,
						panels: [{
							id: "demoline1",
							color: ["#57D9A3", "#79E2F2", "#FFE380", "#8777D9"],
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
							yAxis: {
								show: true,
								type: "value",
								axisLine: {
									show: false
								},
								axisTick: {
									show: false
								},
								axisLabel: {
									show: true,
									color: "#7A869A"
								// formatter: function (value) {
								// 	return value * 100 + axisConfig.unit;
								// }
								},
								splitLine: {
									show: true,
									lineStyle: {
										type: "dotted",
										color: "#DFE1E6"
									}
								}
							},
							tooltip: {
								show: true,
								trigger: "axis",
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
								},
								backgroundColor: "rgba(9,30,66,0.54)"
							},
							legend: {
								show: true,
								x: "center",
								y: "top",
								orient: "horizontal",
								textStyle: {
									fontSize: 14,
									color: "#7A869A"
								}
							},
							series: [{
								type: "line"
							// 	seriesLayoutBy: 'row'
							}, {
								type: "line"
							// 	seriesLayoutBy: 'row'
							}, {
								type: "line"
							// 	seriesLayoutBy: 'row'
							}, {
								type: "line"
							// 	seriesLayoutBy: 'row'
							}]
						}]

					},
					tmProdsLinesCondition = [{
						queryAddress: {
							host: "http://192.168.100.157",
							port: 9000,
							sheet: "tmchart",
							rule: "pivot"
						},
						data: {

							"_source": [
								"date",
								"product",
								"salesRate"
							],
							"query": {
								"bool": {
									"must": [
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
										},
										{
											"match": {
												"date": "all"
											}
										}
									]
								}
							},
							"sort": [
								{ "date": "asc" },
								{ "product": "asc" }
							]
						}
					}]

				resolve( {
					tmProdsLines, tmProdsLinesCondition
				} )
			}, 400 )
		} ).then( data => {
			this.set( "tmProdsLines", data.tmProdsLines )
			this.set( "tmProdsLinesCondition", data.tmProdsLinesCondition )
		} )
	}
} )
