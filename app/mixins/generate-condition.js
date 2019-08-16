import Mixin from "@ember/object/mixin"
import { isEmpty } from "@ember/utils"
import ENV from "new-tmist/config/environment"
export default Mixin.create( {
	queryAddress: ENV.QueryAddress,
	jobId: "d9bfc406-ab6f-4155-9670-d2067272ce4e",
	generateProductCircleCondition( phase ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Product"],
							["eq", "phase", phase],
							["eq", "job_id.keyword", this.jobId]
						]
					},
					"aggs": [
						{
							"groupBy": "phase",
							"aggs": [
								{
									"groupBy": "product.keyword",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": ["sum(sales)"]
					},
					{
						"class": "cut2DArray",
						"args": [
							"product.keyword",
							"sum(sales)",
							"phase",
							"rate(sum(sales))"
						]
					}
				]
			}
		}]
	},
	generateProdBarLineCondition( productName ) {
		let searchRuls = []

		if ( isEmpty( productName ) ) {
			searchRuls = [
				["eq", "category", "Product"]
			]
		} else {
			searchRuls = [
				["eq", "category", "Product"],
				["eq", "product.keyword", productName]
			]
		}
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": searchRuls
					},
					"aggs": [
						{
							"groupBy": "phase",
							"aggs": [
								{
									"groupBy": "product.keyword",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										},
										{
											"agg": "sum",
											"field": "quota"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(quota)"
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"phase",
							"sum(sales)",
							"sum(quota)",
							"rate(sum(quota))",
							"product.keyword"
						]
					}
				]
			}
		}]
	},
	generateRepCircleCondition( phase ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Resource"],
							["eq", "phase", phase]
						]
					},
					"aggs": [
						{
							"groupBy": "representative.keyword",
							"aggs": [
								{
									"groupBy": "phase",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(sales)"
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"representative.keyword",
							"sum(sales)",
							"phase",
							"rate(sum(sales))"
						]
					}
				]
			}
		}]
	},
	generateRepBarLineCondition( repName ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Resource"],
							["eq", "representative.keyword", repName]
						]
					},
					"aggs": [
						{
							"groupBy": "representative.keyword",
							"aggs": [
								{
									"groupBy": "phase",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										},
										{
											"agg": "sum",
											"field": "quota"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(quota)"
						]
					},
					{
						"class": "addCol",
						"args": [
							{
								"name": "product",
								"value": "all"
							}
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"phase",
							"sum(sales)",
							"sum(quota)",
							"rate(sum(quota))",
							"product",
							"representative.keyword"
						]
					}
				]
			}
		}]
	},
	generateHospCircleCondition( phase ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Hospital"],
							["eq", "phase", phase]
						]
					},
					"aggs": [
						{
							"groupBy": "phase",
							"aggs": [
								{
									"groupBy": "hospital_level.keyword",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(sales)"
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"hospital_level.keyword",
							"sum(sales)",
							"phase",
							"rate(sum(sales))"
						]
					}
				]
			}
		}]
	},
	generateHospBarLineCondition( hospName ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "hospital.keyword", hospName]
						]
					},
					"aggs": [
						{
							"groupBy": "hospital.keyword",
							"aggs": [
								{
									"groupBy": "phase",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										},
										{
											"agg": "sum",
											"field": "quota"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(quota)"
						]
					},
					{
						"class": "addCol",
						"args": [
							{
								"name": "product",
								"value": "all"
							}
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"phase",
							"sum(sales)",
							"sum(quota)",
							"rate(sum(quota))",
							"product",
							"hospital.keyword"
						]
					}
				]
			}
		}]
	},
	generateRegionCircleCondition( phase ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Hospital"],
							["eq", "phase", phase]
						]
					},
					"aggs": [
						{
							"groupBy": "hospital.keyword",
							"aggs": [
								{
									"groupBy": "phase",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(sales)"
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"hospital.keyword",
							"sum(sales)",
							"phase",
							"rate(sum(sales))"
						]
					}
				]
			}
		}]
	},
	generateRegionBarLineCondition( productName, hospName ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "product.keyword", productName],
							["eq", "hospital.keyword", hospName]
						]
					},
					"aggs": [
						{
							"groupBy": "phase",
							"aggs": [
								{
									"groupBy": "product.keyword",
									"aggs": [
										{
											"groupBy": "hospital.keyword",
											"aggs": [
												{
													"agg": "sum",
													"field": "sales"
												},
												{
													"agg": "sum",
													"field": "quota"
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "calcRate",
						"args": [
							"sum(quota)"
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"phase",
							"sum(sales)",
							"sum(quota)",
							"rate(sum(quota))",
							"product.keyword",
							"hospital.keyword"
						]
					}
				]
			}
		}]
	},
	generateRepRadarCondition( repName, phase ) {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Resource"],
							["eq", "phase", phase]
						]
					},
					"aggs": [
						{
							"groupBy": "representative.keyword",
							"aggs": [
								{
									"agg": "max",
									"field": "product_knowledge"
								},
								{
									"agg": "max",
									"field": "work_motivation"
								},
								{
									"agg": "max",
									"field": "behavior_efficiency"
								},
								{
									"agg": "max",
									"field": "territory_management_ability"
								},
								{
									"agg": "max",
									"field": "sales_skills"
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "addAvgRow",
						"args": ["representative.keyword"]
					},
					{
						"class": "filter",
						"args": [
							["or", [
								["eq", "representative.keyword", repName],
								["eq", "representative.keyword", "平均值"]
							]]
						]
					},
					{
						"class": "cut2DArray",
						"args": [
							"representative.keyword",
							"max(product_knowledge)",
							"max(work_motivation)",
							"max(behavior_efficiency)",
							"max(territory_management_ability)",
							"max(sales_skills)"
						]
					}
				]
			}
		}]
	},
	generateProdCompLinesCondition() {
		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Product"],
							["eq", "job_id.keyword", this.jobId]
						]
					},
					"aggs": [
						{
							"groupBy": "phase",
							"aggs": [
								{
									"groupBy": "product.keyword",
									"aggs": [
										{
											"agg": "sum",
											"field": "sales"
										}
									]
								}
							]
						}
					]
				},
				"format": [
					{
						"class": "pivot",
						"args": {
							"yAxis": "phase",
							"xAxis": "product.keyword",
							"value": "sum(sales)"
						}
					}
				]
			}
		}]
	}
} )
