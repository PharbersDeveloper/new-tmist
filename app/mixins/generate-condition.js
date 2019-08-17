import Mixin from "@ember/object/mixin"
import { isEmpty } from "@ember/utils"
import { inject as service } from "@ember/service"
import ENV from "new-tmist/config/environment"

export default Mixin.create( {
	runtimeConfig: service( "service/runtime-config" ),
	queryAddress: ENV.QueryAddress,
	jobId: "1c49bb4e-8d8d-4db0-af13-a4aaa4fa64ad",
	getJobId() {
		let jobId = ""

		if ( ENV.environment === "development" ) {
			jobId = this.jobId
		} else {
			jobId = this.runtimeConfig.jobId
		}
		return jobId
	},
	generateProductCircleCondition( phase ) {
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Product"],
							["eq", "phase", phase],
							["eq", "job_id.keyword",jobId]
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
		let searchRuls = [],
			agg = {},
			jobId = this.getJobId()

		if ( isEmpty( productName ) ) {
			searchRuls = [
				["eq", "category", "Product"],
				["eq", "job_id.keyword",jobId]
			]
			agg = [
				{
					"agg": "sum",
					"field": "sales"
				},
				{
					"agg": "sum",
					"field": "quota"
				}
			]
		} else {
			searchRuls = [
				["eq", "category", "Product"],
				["eq", "product.keyword", productName],
				["eq", "job_id.keyword",jobId]
			]
			agg = [
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
							"aggs": agg
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Resource"],
							["eq", "phase", phase],
							["eq", "job_id.keyword",jobId]
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
	generateRepBarLineCondition( repName ,prodName ) {
		let searchRuls = [],
			jobId = this.getJobId()

		if ( isEmpty( prodName ) ) {
			searchRuls = [
				["eq", "category", "Resource"],
				["eq", "representative.keyword", repName],
				["eq", "job_id.keyword",jobId]
			]
		} else {
			searchRuls = [
				["eq", "category", "Resource"],
				["eq", "product", prodName],
				["eq", "representative.keyword", repName],
				["eq", "job_id.keyword",jobId]
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Hospital"],
							["eq", "phase", phase],
							["eq", "job_id.keyword",jobId]
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
	generateHospBarLineCondition( hospName,prodName ) {
		let searchRuls = [],
			jobId = this.getJobId()

		if ( isEmpty( prodName ) ) {
			searchRuls = [
				["eq", "hospital.keyword", hospName],
				["eq", "job_id.keyword",jobId]
			]
		} else {
			searchRuls = [
				["eq", "product", prodName],
				["eq", "hospital.keyword", hospName],
				["eq", "job_id.keyword",jobId]
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Hospital"],
							["eq", "phase", phase],
							["eq", "job_id.keyword",jobId]
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "product.keyword", productName],
							["eq", "hospital.keyword", hospName],
							["eq", "job_id.keyword",jobId]
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Resource"],
							["eq", "phase", phase],
							["eq", "job_id.keyword",jobId]
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
		let jobId = this.getJobId()

		return [{
			queryAddress: this.queryAddress,
			data: {
				"model": "tmrs",
				"query": {
					"search": {
						"and": [
							["eq", "category", "Product"],
							["eq", "job_id.keyword",jobId]
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
