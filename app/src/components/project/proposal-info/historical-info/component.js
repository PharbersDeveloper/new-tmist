import Component from "@ember/component"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import EmberObject from "@ember/object"
import { htmlSafe } from "@ember/template"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"
import { formatPhaseToDate, formatPhaseToStringDefault } from "new-tmist/utils/format-phase-date"
import { all } from "rsvp"
import ENV from "new-tmist/config/environment"

export default Component.extend( GenerateCondition, GenerateChartConfig, {
	// ossService: service( "service/oss" ),
	ajax: service(),
	// cookies: service(),
	exportService: service( "service/export-report" ),
	positionalParams: ["periods", "resources", "products", "hospitals", "case", "project", "proposal"],
	salesGroupValue: 0,
	classNames: ["report-wrapper"],
	selfProducts: computed( "products", function () {
		let products = this.products

		if ( isEmpty( products ) ) {
			return products
		}
		return products.filterBy( "productType", 0 )
	} ),
	/**
	 * @author Frank Wang
	 * @property
	 * @name isResultPage
	 * @description 是否是结果页面
	 * @type {Boolean}
	 * @default false
	 * @public
	*/
	isResultPage: false,
	// TODO 有区域实体之后，替换为区域实体
	regions: A( [{ name: "会东市", id: 1 }, { name: "会南市", id: 2 }, { name: "会西市", id: 3 }] ),
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
	dealData( data, config, name, property ) {
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
				productInfo.name = productInfo[`${name}.keyword`]
				productInfo.salesRate = productInfo["rate(sum(sales))"]
				productInfo.sales = productInfo["sum(sales)"]

				return productInfo
			} )

		this.set( property, productsData )
	},
	// downloadURI( urlName ) {
	// 	fetch( urlName.url )
	// 		.then( response => {
	// 			if ( response.status === 200 ) {
	// 				return response.blob()
	// 			}
	// 			throw new Error( `status: ${response.status}` )
	// 		} )
	// 		.then( blob => {
	// 			var link = document.createElement( "a" )

	// 			link.download = urlName.name
	// 			// var blob = new Blob([response]);
	// 			link.href = URL.createObjectURL( blob )
	// 			// link.href = url;
	// 			document.body.appendChild( link )
	// 			link.click()
	// 			document.body.removeChild( link )
	// 			// delete link;

	// 			window.console.log( "success" )
	// 		} )
	// 		.catch( error => {
	// 			window.console.log( "failed. cause:", error )
	// 		} )
	// },
	// genDownloadUrl() {

	// 	this.get( "ajax" ).request( `/export/${this.project.get( "id" )}/phase/${this.project.get( "periods" ).length - 1}`, {
	// 		headers: {
	// 			"dataType": "json",
	// 			"Content-Type": "application/json",
	// 			"Authorization": `Bearer ${this.cookies.read( "access_token" )}`
	// 		}
	// 	} ).then( res => {
	// 		window.console.log( res )
	// 		let { jobId } = res,
	// 			downloadUrl = jobId + ".xlsx",
	// 			client = this.ossService.get( "ossClient" ),
	// 			url = client.signatureUrl( "tm-export/" + downloadUrl, { expires: 43200 } )

	// 		window.console.log( res )
	// 		window.console.log( "Success!" )
	// 		this.downloadURI( { url: url, name: "历史销售报告" } )
	// 		// return { url: url, name: downloadUrl }
	// 	} )
	// },
	actions: {
		exportReport() {
			// this.genDownloadUrl()
			this.exportService.exportReport( this.project, this.project.get( "periods" ).length - 1 )
		},
		changeSalesValue( value ) {
			this.set( "salesGroupValue", value )
		},
		dealProd0Data( data, config ) {
			this.dealData( data, config, "product", "product0Legend" )
		},
		dealProd1Data( data, config ) {
			this.dealData( data, config, "product", "product1Legend" )
		},
		chooseProd( prod ) {
			let salesGroupValue = this.salesGroupValue

			// TODO switch更清晰
			if ( salesGroupValue === 0 ) {
				this.set( "tmpPsr", prod )
				this.set( "tmProductBarLineCondition", this.generateProdBarLineCondition( prod.name, this.proposal ) )
			} else if ( salesGroupValue === 1 ) {
				this.set( "tmpProdRep", prod )
				this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( this.tmpRep.name, prod.name, this.proposal ) )
			} else if ( salesGroupValue === 2 ) {
				this.set( "tmpProdHosp", prod )
				this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( this.tmpHosp.name, prod.name, this.proposal ) )
			} else if ( salesGroupValue === 3 ) {
				let regName = isEmpty( this.tmpReg ) ? "" : this.tmpReg.name

				this.set( "tmpProdReg", prod )
				this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( regName, prod.name, this.proposal ) )
			}
		},
		changeTableProd( prod ) {
			let prodName = prod.name,
				salesGroupValue = this.salesGroupValue

			// TODO switch更清晰
			if ( salesGroupValue === 0 ) {
				// this.set( "tmpPsr", prod )
				// this.set( "tmProductBarLineCondition", this.generateProdBarLineCondition( prod.name, this.proposal ) )
			} else if ( salesGroupValue === 1 ) {
				this.set( "representativeProdTable", prod )
				let type = isEmpty( prod ) ? "rep_ref" : "rep_prod"

				this.queryData( type ,prodName ).then( data => {
					let currentData = data.filterBy( "product",prodName )

					this.set( "representativeTableData", currentData )
				} )
			} else if ( salesGroupValue === 2 ) {
				this.set( "hospitalProdTable", prod )
				let type = isEmpty( prod ) ? "hospital_ref" : "hospital_prod"

				this.queryData( type ,prodName ).then( data => {
					let currentData = data.filterBy( "product",prodName )

					this.set( "hospitalTableData", currentData )
				} )
			} else if ( salesGroupValue === 3 ) {
				this.set( "regionProdTable", prod )
				let type = isEmpty( prod ) ? "region_ref" : "region_prod"

				this.queryData( type ,prodName ).then( data => {
					let currentData = data.filterBy( "product",prodName )

					this.set( "regionTableData", currentData )
				} )
			}
		},
		chooseRep( rep ) {
			let prodName = this.tmpProdRep && this.tmpProdRep.name

			this.set( "tmpRep", rep )
			this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( rep.name, prodName, this.proposal ) )
		},
		chooseHosp( hosp ) {
			let prodName = this.tmpProdHosp && this.tmpProdHosp.name

			this.set( "tmpHosp", hosp )
			this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( hosp.name, prodName, this.proposal ) )
		},
		chooseReg( reg ) {
			let prodName = this.tmpProdReg && this.tmpProdReg.name

			this.set( "tmpReg", reg )
			this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( reg.name, prodName, this.proposal ) )
		},
		dealRep0Data( data, config ) {
			this.dealData( data, config, "representative", "rep0Legend" )
		},
		dealRep1Data( data, config ) {
			this.dealData( data, config, "representative", "rep1Legend" )
		},
		dealHosp0Data( data, config ) {
			this.dealData( data, config, "hospital_level", "Hosp0Legend" )
		},
		dealHosp1Data( data, config ) {
			this.dealData( data, config, "hospital_level", "Hosp1Legend" )
		},
		dealReg0Data( data, config ) {
			this.dealData( data, config, "region", "Reg0Legend" )
		},
		dealReg1Data( data, config ) {
			this.dealData( data, config, "region", "Reg1Legend" )
		}
	},
	didReceiveAttrs() {
		this._super( ...arguments )
		const that = this

		let defaultRep = this.resources.firstObject,
			defaultHosp = this.hospitals.firstObject,
			proposalCase = this.case,
			isResultPage = this.isResultPage,
			sortPeriods = this.periods.sortBy( "phase" ),
			currentPeriod = sortPeriods.get( "lastObject.phase" ),	 // 当前周期的 phase
			prevOne = isResultPage ? currentPeriod : currentPeriod - 1,//当为结果页面的时候显示当前周期，否则展示上一周期
			prevTwo = isResultPage ? currentPeriod - 1 : currentPeriod - 2,//当为结果页面的时候展示上一周期，否则展示上两个周期
			date = formatPhaseToDate( that.proposal.get( "periodBase" ), that.proposal.get( "periodStep" ), prevOne ),
			tableSalesQuotas = that.createDynamicTableHead( prevOne, "销售指标", "quota" ),
			tableSales = that.createDynamicTableHead( prevOne, "销售额", "sales" ),
			time = formatPhaseToStringDefault( date ),
			productColumns = A( [
				{
					label: "药品名称",
					valuePath: "product",
					align: "left",
					// sortable: true,
					width: 64
				}, {
					label: `指标贡献率<br />${time}`,
					valuePath: "quota_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标增长率<br />${time}`,
					valuePath: "quota_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标达成率<br />${time}`,
					valuePath: "quota_rate",
					align: "left",
					sortable: true,
					cellComponent: "common/table/decimal-to-percentage",
					width: 100
				}, {
					label: `销售额同比增长<br />${time}`,
					valuePath: "year_on_year_sales",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额环比增长<br />${time}`,
					valuePath: "sales_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `YTD销售额<br />${time}`,
					valuePath: "ytd_sales",
					align: "right",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}
			] ),
			representativeColumns = A( [
				{
					label: "代表名称",
					valuePath: "representative",
					align: "left",
					// sortable: true,
					width: 64
				}, {
					label: "患者数量",
					valuePath: "current_patient_num",
					align: "left",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 64
				}, {
					label: `指标贡献率<br />${time}`,
					valuePath: "quota_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标增长率<br />${time}`,
					valuePath: "quota_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标达成率<br />${time}`,
					valuePath: "quota_rate",
					align: "left",
					sortable: true,
					cellComponent: "common/table/decimal-to-percentage",
					width: 100
				}, {
					label: `销售额同比增长<br />${time}`,
					valuePath: "year_on_year_sales",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额环比增长<br />${time}`,
					valuePath: "sales_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额贡献率<br />${time}`,
					valuePath: "sales_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `YTD销售额<br />${time}`,
					valuePath: "ytd_sales",
					align: "right",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}
			] ),
			hospitalColumns = A( [
				{
					label: "医院名称",
					valuePath: "hospital",
					align: "left",
					// sortable: true,
					width: 200
				}, {
					label: "代表",
					valuePath: "representative",
					align: "left",
					// sortable: true,
					width: 64
				}, {
					label: "患者数量",
					valuePath: "current_patient_num",
					align: "left",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 64
				}, {
					label: "药品准入情况",
					valuePath: "status",
					align: "center",
					// sortable: true,
					width: 90
				}, {
					label: `指标贡献率<br />${time}`,
					valuePath: "quota_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标增长率<br />${time}`,
					valuePath: "quota_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标达成率<br />${time}`,
					valuePath: "quota_rate",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					// sortable: true,
					width: 100
				}, {
					label: `销售额同比增长<br />${time}`,
					valuePath: "year_on_year_sales",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额环比增长<br />${time}`,
					valuePath: "sales_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					// sortable: true,
					width: 120
				}, {
					label: `销售额贡献率<br />${time}`,
					valuePath: "sales_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `YTD销售额<br />${time}`,
					valuePath: "ytd_sales",
					align: "right",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}, {
					label: `院内销售额<br />${time}`,
					valuePath: "inter_sales",
					align: "center",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}, {
					label: `院外销售额<br />${time}`,
					valuePath: "outer_sales",
					align: "center",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}

			] ),
			regionColumns = A( [
				{
					label: "城市名称",
					valuePath: "region",
					align: "left",
					// sortable: true,
					width: 64
				}, {
					label: "患者数量",
					valuePath: "current_patient_num",
					align: "left",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 64
				}, {
					label: `指标贡献率<br />${time}`,
					valuePath: "quota_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标增长率<br />${time}`,
					valuePath: "quota_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `指标达成率<br />${time}`,
					valuePath: "quota_rate",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `销售额同比增长<br />${time}`,
					valuePath: "year_on_year_sales",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额环比增长<br />${time}`,
					valuePath: "sales_growth",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 120
				}, {
					label: `销售额贡献率<br />${time}`,
					valuePath: "sales_contri",
					align: "left",
					cellComponent: "common/table/decimal-to-percentage",
					sortable: true,
					width: 100
				}, {
					label: `YTD销售额<br />${time}`,
					valuePath: "ytd_sales",
					align: "right",
					cellComponent: "common/table/format-number-thousands",
					sortable: true,
					width: 110
				}
			] )

		this.set( "tmpRep", defaultRep )
		this.set( "tmpHosp", defaultHosp )

		new Promise( function ( resolve ) {
			let tmProductCircle0 = that.generateCircleChart( "circleproductcontainer0", "tmcircleproduct0" ),
				tmProductCircle1 = that.generateCircleChart( "circleproductcontainer1", "tmcircleproduct1" ),
				tmProductCircleCondition = that.generateProductCircleCondition( proposalCase, prevOne ),
				tmProductCircle0Condition = that.generateProductCircleCondition( proposalCase, prevTwo ),
				tmProductBarLine0 = that.generateBarLineConfig( "tmProductBarLineContainer", "bartmProductBarLine0" ),
				tmProductBarLineCondition = that.generateProdBarLineCondition( "", that.proposal ),
				tmRepCircle0 = that.generateCircleChart( "representativeCircleContainer0", "tmcircleRepresentative0" ),
				tmRepCircle1 = that.generateCircleChart( "circleRepresentativeContainer1", "tmcirclerepresentative1" ),
				tmRepCircleCondition = that.generateRepCircleCondition( prevOne ),
				tmRepCircle0Condition = that.generateRepCircleCondition( prevTwo ),
				tmRepBarLine0 = that.generateBarLineConfig( "tmRepresentativeBarLineContainer", "bartmRepresentativeBarLine0" ),
				tmRepBarLineCondition = that.generateRepBarLineCondition( defaultRep.name, "", that.proposal ),
				tmHosCircle0 = that.generateCircleChart( "hospitalCircleContainer0", "tmcircleHospital0" ),
				tmHosCircle1 = that.generateCircleChart( "hospitalCircleContainer1", "tmcircleHospital1" ),
				tmHosCircleCondition = that.generateHospCircleCondition( prevOne ),
				tmHosCircle0Condition = that.generateHospCircleCondition( prevTwo ),
				tmHosBarLine0 = that.generateBarLineConfig( "tmHospitalBarLineContainer", "bartmHospitalBarLine0" ),
				tmHosBarLineCondition = that.generateHospBarLineCondition( defaultHosp.name, "", that.proposal ),
				tmRegCircle0 = that.generateCircleChart( "regionCircleContainer0", "tmcircleregion0" ),
				tmRegCircle1 = that.generateCircleChart( "regionCircleContainer1", "tmcircleregion1" ),
				tmRegCircleCondition = that.generateRegionCircleCondition( prevOne ),
				tmRegCircle0Condition = that.generateRegionCircleCondition( prevTwo ),
				tmRegBarLine0 = that.generateBarLineConfig( "tmRegionBarLineContainer", "bartmRegionBarLine0" ),
				tmRegBarLineCondition = that.generateRegionBarLineCondition( "", "", that.proposal ) // 查询区域全部总值&&产品全部总值

			resolve( {
				tmProductCircle0, tmProductCircle1, tmProductCircleCondition, tmProductCircle0Condition, tmProductBarLine0, tmProductBarLineCondition,
				tmRepCircle0, tmRepCircle1, tmRepCircleCondition, tmRepCircle0Condition, tmRepBarLine0, tmRepBarLineCondition,
				tmHosCircle0, tmHosCircle1, tmHosCircleCondition, tmHosCircle0Condition, tmHosBarLine0, tmHosBarLineCondition,
				tmRegCircle0, tmRegCircle1, tmRegCircleCondition, tmRegCircle0Condition, tmRegBarLine0, tmRegBarLineCondition

			} )
		} ).then( data => {
			this.set( "tmProductCircle0", data.tmProductCircle0 )
			this.set( "tmProductCircleCondition", data.tmProductCircleCondition )
			this.set( "tmProductCircle1", data.tmProductCircle1 )
			this.set( "tmProductCircle0Condition", data.tmProductCircle0Condition )
			this.set( "tmProductBarLine0", data.tmProductBarLine0 )
			this.set( "tmProductBarLineCondition", data.tmProductBarLineCondition )
			this.set( "tmRepCircle0", data.tmRepCircle0 )
			this.set( "tmRepCircle1", data.tmRepCircle1 )
			this.set( "tmRepCircleCondition", data.tmRepCircleCondition )
			this.set( "tmRepCircle0Condition", data.tmRepCircle0Condition )
			this.set( "tmRepBarLine0", data.tmRepBarLine0 )
			this.set( "tmRepBarLineCondition", data.tmRepBarLineCondition )
			this.set( "tmHosCircle0", data.tmHosCircle0 )
			this.set( "tmHosCircle1", data.tmHosCircle1 )
			this.set( "tmHosCircleCondition", data.tmHosCircleCondition )
			this.set( "tmHosCircle0Condition", data.tmHosCircle0Condition )
			this.set( "tmHosBarLine0", data.tmHosBarLine0 )
			this.set( "tmHosBarLineCondition", data.tmHosBarLineCondition )
			this.set( "tmRegCircle0", data.tmRegCircle0 )
			this.set( "tmRegCircle1", data.tmRegCircle1 )
			this.set( "tmRegCircleCondition", data.tmRegCircleCondition )
			this.set( "tmRegCircle0Condition", data.tmRegCircle0Condition )
			this.set( "tmRegBarLine0", data.tmRegBarLine0 )
			this.set( "tmRegBarLineCondition", data.tmRegBarLineCondition )
		} )

		productColumns = productColumns.concat( tableSales ).concat( tableSalesQuotas )
		representativeColumns = representativeColumns.concat( tableSales ).concat( tableSalesQuotas )
		hospitalColumns = hospitalColumns.concat( tableSales ).concat( tableSalesQuotas )
		regionColumns = regionColumns.concat( tableSales ).concat( tableSalesQuotas )

		this.set( "productColumns", productColumns )
		this.set( "representativeColumns", representativeColumns )
		this.set( "hospitalColumns", hospitalColumns )
		this.set( "regionColumns", regionColumns )

		all( [that.queryData( "product_ref" ),
			this.queryData( "region_ref" ),
			this.queryData( "rep_ref" ),
			this.queryData( "hospital_ref" )
		] ).then( data => {
			this.set( "productTableData", data[0] )
			this.set( "regionTableData", data[1] )
			this.set( "representativeTableData", data[2] )
			this.set( "hospitalTableData", data[3] )
		} )
	},
	createDynamicTableHead( seasonNumber, headText, headWord ) {
		const that = this

		let miniSeason = -4,
			len = seasonNumber - miniSeason + 1,
			arr = []

		for ( let i = 0; i < len; i++ ) {
			arr.push( miniSeason + i )
		}
		return arr.map( ele => {
			return {
				label: headText + "<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ), that.proposal.get( "periodStep" ), ele ) ),
				valuePath: headWord + "_" + ele,
				cellComponent: "common/table/format-number-thousands",
				align: "right",
				sortable: true,
				width: 110
			}
		} )
	},
	/**
	 * @author Frank Wang
	 * @property
	 * @name queryAddress
	 * @description 数据请求的地址
	 * @type {Object}
	 * @default {}
	 * @public
	 */
	tableQueryAddress: ENV.tableQueryAddress,

	// tableQueryAddress: EmberObject.create( {
	// 	host: "http://192.168.100.116",
	// 	port: 9202,
	// 	version: "v1.0",
	// 	db: "NTM"
	// } ),
	queryData( type,prod ) {
		let qa = this.get( "tableQueryAddress" ),
			proposalId = this.proposal.get( "id" ),
			projectId = this.project.get( "id" )
			// projectId = this.get( "project.id" ) || localStorage.getItem( "projectId" )

		return this.get( "ajax" ).request( `${qa.host}:${qa.port}/${qa.version}/${qa.db}/${type}`, {
			method: "GET",
			data: JSON.stringify( {
				"model": "tmrs_new",
				"query": {
					// "proposal_id": "5d79c5761c3bac3244ab93c6",
					"proposal_id": proposalId,
					// "project_id": "5d78ac93515b2b002b74a414",
					"project_id": projectId,
					// "product":prod,
					"point_origin": "2019Q1"
				}
			}
			),
			dataType: "json"
		} )
	}
} )

