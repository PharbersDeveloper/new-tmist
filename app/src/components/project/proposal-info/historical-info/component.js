import Component from "@ember/component"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"
import { htmlSafe } from "@ember/template"
import GenerateCondition from "new-tmist/mixins/generate-condition"
import GenerateChartConfig from "new-tmist/mixins/generate-chart-config"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"
import { formatPhaseToDate, formatPhaseToStringDefault } from "new-tmist/utils/format-phase-date"

export default Component.extend( GenerateCondition,GenerateChartConfig, {
	// ossService: service( "service/oss" ),
	// ajax: service(),
	// cookies: service(),
	exportService: service( "service/export-report" ),
	positionalParams: ["periods", "resources", "products", "hospitals","case", "project"],
	salesGroupValue: 0,
	classNames: ["report-wrapper"],
	selfProducts: computed( "products",function() {
		let products = this.products

		if ( isEmpty( products ) ) {
			return products
		}
		return products.filterBy( "productType",0 )
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
		if ( !this.periods ) {
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
	// downloadURI( urlName ) {
	// 	window.console.log( urlName )
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
			this.dealData( data,config,"product","product0Legend" )
		},
		dealProd1Data( data, config ) {
			this.dealData( data,config,"product","product1Legend" )
		},
		chooseProd( prod ) {
			let salesGroupValue = this.salesGroupValue

			// TODO switch更清晰
			if ( salesGroupValue === 0 ) {
				this.set( "tmpPsr",prod )
				this.set( "tmProductBarLineCondition", this.generateProdBarLineCondition( prod.name,this.proposal ) )
			} else if ( salesGroupValue === 1 ) {
				this.set( "tmpProdRep",prod )
				this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( this.tmpRep.name, prod.name,this.proposal ) )
			} else if ( salesGroupValue === 2 ) {
				this.set( "tmpProdHosp",prod )
				this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( this.tmpHosp.name, prod.name,this.proposal ) )
			} else if ( salesGroupValue === 3 ) {
				let regName = isEmpty( this.tmpReg ) ? "" : this.tmpReg.name

				this.set( "tmpProdReg",prod )
				this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( regName, prod.name,this.proposal ) )
			}
		},
		chooseRep( rep ) {
			let prodName = this.tmpProdRep && this.tmpProdRep.name

			this.set( "tmpRep",rep )
			this.set( "tmRepBarLineCondition", this.generateRepBarLineCondition( rep.name,prodName ,this.proposal ) )
		},
		chooseHosp( hosp ) {
			let prodName = this.tmpProdHosp && this.tmpProdHosp.name

			this.set( "tmpHosp",hosp )
			this.set( "tmHosBarLineCondition", this.generateHospBarLineCondition( hosp.name,prodName,this.proposal ) )
		},
		chooseReg( reg ) {
			let prodName = this.tmpProdReg && this.tmpProdReg.name

			this.set( "tmpReg",reg )
			this.set( "tmRegBarLineCondition", this.generateRegionBarLineCondition( reg.name,prodName ,this.proposal ) )
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
			prevTwo = isResultPage ? currentPeriod - 1 : currentPeriod - 2//当为结果页面的时候展示上一周期，否则展示上两个周期

		this.set( "tmpRep",defaultRep )
		this.set( "tmpHosp",defaultHosp )

		new Promise( function ( resolve ) {
			let tmProductCircle0 = that.generateCircleChart( "circleproductcontainer0","tmcircleproduct0" ),
				tmProductCircle1 = that.generateCircleChart( "circleproductcontainer1","tmcircleproduct1" ),
				tmProductCircleCondition = that.generateProductCircleCondition( proposalCase, prevOne ),
				tmProductCircle0Condition = that.generateProductCircleCondition( proposalCase, prevTwo ),
				tmProductBarLine0 = that.generateBarLineConfig( "tmProductBarLineContainer","bartmProductBarLine0" ),
				tmProductBarLineCondition = that.generateProdBarLineCondition( "",that.proposal ),
				tmRepCircle0 = that.generateCircleChart( "representativeCircleContainer0","tmcircleRepresentative0" ),
				tmRepCircle1 = that.generateCircleChart( "circleRepresentativeContainer1","tmcirclerepresentative1" ),
				tmRepCircleCondition = that.generateRepCircleCondition( prevOne ),
				tmRepCircle0Condition = that.generateRepCircleCondition( prevTwo ),
				tmRepBarLine0 = that.generateBarLineConfig( "tmRepresentativeBarLineContainer","bartmRepresentativeBarLine0" ),
				tmRepBarLineCondition = that.generateRepBarLineCondition( defaultRep.name,"",that.proposal ),
				tmHosCircle0 = that.generateCircleChart( "hospitalCircleContainer0","tmcircleHospital0" ),
				tmHosCircle1 = that.generateCircleChart( "hospitalCircleContainer1","tmcircleHospital1" ),
				tmHosCircleCondition = that.generateHospCircleCondition( prevOne ),
				tmHosCircle0Condition = that.generateHospCircleCondition( prevTwo ),
				tmHosBarLine0 = that.generateBarLineConfig( "tmHospitalBarLineContainer","bartmHospitalBarLine0" ),
				tmHosBarLineCondition = that.generateHospBarLineCondition( defaultHosp.name ,"",that.proposal ),
				tmRegCircle0 = that.generateCircleChart( "regionCircleContainer0","tmcircleregion0" ),
				tmRegCircle1 = that.generateCircleChart( "regionCircleContainer1","tmcircleregion1" ),
				tmRegCircleCondition = that.generateRegionCircleCondition( prevOne ),
				tmRegCircle0Condition = that.generateRegionCircleCondition( prevTwo ),
				tmRegBarLine0 = that.generateBarLineConfig( "tmRegionBarLineContainer","bartmRegionBarLine0" ),
				tmRegBarLineCondition = that.generateRegionBarLineCondition( "","",that.proposal ) // 查询区域全部总值&&产品全部总值

			resolve( {
				tmProductCircle0, tmProductCircle1, tmProductCircleCondition, tmProductCircle0Condition,tmProductBarLine0, tmProductBarLineCondition,
				tmRepCircle0, tmRepCircle1, tmRepCircleCondition,tmRepCircle0Condition, tmRepBarLine0, tmRepBarLineCondition,
				tmHosCircle0, tmHosCircle1, tmHosCircleCondition,tmHosCircle0Condition, tmHosBarLine0, tmHosBarLineCondition,
				tmRegCircle0, tmRegCircle1, tmRegCircleCondition,tmRegCircle0Condition, tmRegBarLine0, tmRegBarLineCondition

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

		new Promise( function ( resolve ) {
			const date = formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevOne )


			let time = formatPhaseToStringDefault( date ),
				productColumns = A( [
					{
						label: "产品名称",
						valuePath: "name",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: `指标贡献率<br />${time}`,
						valuePath: "ratecontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标增长率<br />${time}`,
						valuePath: "growth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标达成率<br />${time}`,
						valuePath: "yield",
						align: "left",
						// sortable: true,
						// cellComponent: 'table/decimal-to-percentage',
						width: 100
					},{
						label: `销售额同比增长<br />${time}`,
						valuePath: "yoygrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额环比增长<br />${time}`,
						valuePath: "rosegrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额贡献率<br />${time}`,
						valuePath: "salescontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `YTD销售额<br />${time}`,
						valuePath: "ytd",
						align: "right",
						// sortable: true,
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "quota3",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "quota2",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "quota1",
						align: "right",
						width: 110
					},{
						label: `销售指标<br />${time}`,
						valuePath: "quota0",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "sales3",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "sales2",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "sales1",
						align: "right",
						width: 110
					},{
						label: `销售额<br />${time}`,
						valuePath: "sales0",
						align: "right",
						width: 110
					}
				] ),
				productTableData = A( [] ),
				representativeColumns = A( [
					{
						label: "代表名称",
						valuePath: "name",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "患者数量",
						valuePath: "patients",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: `指标贡献率<br />${time}`,
						valuePath: "ratecontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标增长率<br />${time}`,
						valuePath: "growth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标达成率<br />${time}`,
						valuePath: "yield",
						align: "left",
						// sortable: true,
						// cellComponent: 'table/decimal-to-percentage',
						width: 100
					},{
						label: `销售额同比增长<br />${time}`,
						valuePath: "yoygrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额环比增长<br />${time}`,
						valuePath: "rosegrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额贡献率<br />${time}`,
						valuePath: "salescontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `YTD销售额<br />${time}`,
						valuePath: "ytd",
						align: "right",
						// sortable: true,
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "quota3",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "quota2",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "quota1",
						align: "right",
						width: 110
					},{
						label: `销售指标<br />${time}`,
						valuePath: "quota0",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "sales3",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "sales2",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "sales1",
						align: "right",
						width: 110
					},{
						label: `销售额<br />${time}`,
						valuePath: "sales0",
						align: "right",
						width: 110
					}
				] ),
				hospitalColumns = A( [
					{
						label: "医院名称",
						valuePath: "name",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "代表",
						valuePath: "rep",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "患者数量",
						valuePath: "patients",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "药品准入情况",
						valuePath: "access",
						align: "center",
						// sortable: true,
						width: 90
					},{
						label: `指标贡献率<br />${time}`,
						valuePath: "ratecontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标增长率<br />${time}`,
						valuePath: "growth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标达成率<br />${time}`,
						valuePath: "yield",
						align: "left",
						// sortable: true,
						// cellComponent: 'table/decimal-to-percentage',
						width: 100
					},{
						label: `销售额同比增长<br />${time}`,
						valuePath: "yoygrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额环比增长<br />${time}`,
						valuePath: "rosegrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额贡献率<br />${time}`,
						valuePath: "salescontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `YTD销售额<br />${time}`,
						valuePath: "ytd",
						align: "right",
						// sortable: true,
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "quota3",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "quota2",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "quota1",
						align: "right",
						width: 110
					},{
						label: `销售指标<br />${time}`,
						valuePath: "quota0",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "sales3",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "sales2",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "sales1",
						align: "right",
						width: 110
					},{
						label: `销售额<br />${time}`,
						valuePath: "sales0",
						align: "right",
						width: 110
					}
				] ),
				regionColumns = A( [
					{
						label: "城市名称",
						valuePath: "name",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "患者数量",
						valuePath: "patients",
						align: "left",
						// sortable: true,
						width: 64
					},{
						label: "药品准入情况",
						valuePath: "access",
						align: "center",
						// sortable: true,
						width: 90
					},{
						label: `指标贡献率<br />${time}`,
						valuePath: "ratecontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标增长率<br />${time}`,
						valuePath: "growth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `指标达成率<br />${time}`,
						valuePath: "yield",
						align: "left",
						// sortable: true,
						// cellComponent: 'table/decimal-to-percentage',
						width: 100
					},{
						label: `销售额同比增长<br />${time}`,
						valuePath: "yoygrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额环比增长<br />${time}`,
						valuePath: "rosegrowth",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `销售额贡献率<br />${time}`,
						valuePath: "salescontribution",
						align: "left",
						// sortable: true,
						width: 100
					},{
						label: `YTD销售额<br />${time}`,
						valuePath: "ytd",
						align: "right",
						// sortable: true,
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "quota3",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "quota2",
						align: "right",
						width: 110
					},{
						label: "销售指标<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "quota1",
						align: "right",
						width: 110
					},{
						label: `销售指标<br />${time}`,
						valuePath: "quota0",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 3 ) ),
						valuePath: "sales3",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 2 ) ),
						valuePath: "sales2",
						align: "right",
						width: 110
					},{
						label: "销售额<br />" + formatPhaseToStringDefault( formatPhaseToDate( that.proposal.get( "periodBase" ),that.proposal.get( "periodStep" ),prevTwo - 1 ) ),
						valuePath: "sales1",
						align: "right",
						width: 110
					},{
						label: `销售额<br />${time}`,
						valuePath: "sales0",
						align: "right",
						width: 110
					}
				] )

			resolve( {
				productColumns, productTableData,representativeColumns,hospitalColumns,regionColumns

			} )
		} ).then( data => {
			this.set( "productColumns", data.productColumns )
			this.set( "productTableData", data.productTableData )
			this.set( "representativeColumns", data.representativeColumns )
			this.set( "hospitalColumns", data.hospitalColumns )
			this.set( "regionColumns", data.regionColumns )

		} )
	  }
} )

