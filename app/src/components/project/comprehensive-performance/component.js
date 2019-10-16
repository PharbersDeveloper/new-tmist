import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	classNames: ["performance-wrapper"],
	positionalParams: ["project", "proviousReport", "evaluations"],
	axisName: "区域能力划分",
	axisLevel: null,
	curFinal: computed( "project", "proviousReport", function() {
		let curReport = this.proviousReport.filter( pro => pro.project.get( "id" ) === this.project.get( "id" ) ).get( "firstObject" )

		return curReport.reports.get( "firstObject" )
	} ),
	levelObj: computed( function() {
		return {
			1: "D", 2: "C", 3: "B", 4: "A", 5: "S"
		}
	} ),
	nameLevel: computed( "curFinal", function() {
		if ( this.curFinal.get( "generalPerformance" ) === 3 ) {
			return "黄金"
		} else if ( this.curFinal.get( "generalPerformance" ) === 2 ) {
			return "白银"
		} else {
			return "青铜"
		}
	} ),
	curLink: computed( "nameLevel", function() {
		if ( this.nameLevel === "黄金" ) {
			return "https://pharbers-images.oss-cn-beijing.aliyuncs.com/pharbers-ucb/level/img_level_gold%402x.png"
		} else if ( this.nameLevel === "白银" ) {
			return "https://pharbers-images.oss-cn-beijing.aliyuncs.com/pharbers-ucb/level/img_level_silver%402x.png"
		} else {
			return "https://pharbers-images.oss-cn-beijing.aliyuncs.com/pharbers-ucb/level/img_level_bronze%402x.png"
		}
	} ),
	radarData: computed( "curFinal", "levelObj",function() {
		this.set( "axisLevel", this.levelObj[this.curFinal.get( "regionDivision" )] )
		return A( [{
			value: [this.curFinal.get( "regionDivision" ), this.curFinal.get( "manageTeam" ), this.curFinal.get( "manageTime" ),
				this.curFinal.get( "resourceAssigns" ),this.curFinal.get( "targetAssigns" )],
			name: "能力分析"
		}] )
	} ),
	actionAndDesc: computed( "evaluations", "axisLevel", "axisName",function() {
		let category = null

		switch ( this.axisName ) {
		case "区域划分能力":
			category = "Area"
			break
		case "领导力":
			category = "Leader"
			break
		case "自我时间管理能力":
			category = "Time"
			break
		case "资源优化能力":
			category = "Resource"
			break
		case "指标分配能力":
			category = "Quota"
			break
		default:
			category = "Area"
			break
		}
		// window.console.log( this.axisName )
		// window.console.log( this.evaluations )
		// window.console.log( category )

		let arr = this.evaluations.filter( eva => eva.get( "category" ) === category ),
			descObj = null

		switch ( this.axisLevel ) {
		case "S":
			descObj = {
				actions : arr.filter( it => it.get( "level" ) === "卓越" ).get( "firstObject" ).actionDescription,
				levels: arr.filter( it => it.get( "level" ) === "卓越" ).get( "firstObject" ).levelDescription
			}
			break
		case "A":
			descObj = {
				actions : arr.filter( it => it.get( "level" ) === "优秀" ).get( "firstObject" ).actionDescription,
				levels: arr.filter( it => it.get( "level" ) === "优秀" ).get( "firstObject" ).levelDescription
			}
			break
		case "B":
			// window.console.log( arr )
			descObj = {
				actions : arr.filter( it => it.get( "level" ) === "有待改善" ).get( "firstObject" ).actionDescription,
				levels: arr.filter( it => it.get( "level" ) === "有待改善" ).get( "firstObject" ).levelDescription
			}
			break
		default:
			break
		}
		// window.console.log( descObj )
		return descObj

	} ),
	actions: {
		//items: A(['区域划分能力', '领导力', '自我时间管理能力', '资源优化能力', '指标分配能力']),
		changeRadar( axisName ) {
			this.set( "axisName",axisName )
			switch ( axisName ) {
			case "区域划分能力":
				this.set( "axisLevel", this.levelObj[this.curFinal.get( "regionDivision" )] )
				break
			case "领导力":
				this.set( "axisLevel", this.levelObj[this.curFinal.get( "manageTeam" )] )
				break
			case "自我时间管理能力":
				this.set( "axisLevel", this.levelObj[this.curFinal.get( "manageTime" )] )
				break
			case "资源优化能力":
				this.set( "axisLevel", this.levelObj[this.curFinal.get( "resourceAssigns" )] )
				break
			case "指标分配能力":
				this.set( "axisLevel", this.levelObj[this.curFinal.get( "targetAssigns" )] )
				break
			default:
				break
			}
		}
	}
} )
