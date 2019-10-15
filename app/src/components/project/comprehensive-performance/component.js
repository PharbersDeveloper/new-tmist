import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"

export default Component.extend( {
	classNames: ["performance-wrapper"],
	positionalParams: ["project", "proviousReport"],
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
	radarData: computed( "curFinal", "levelObj",function() {
		this.set( "axisLevel", this.levelObj[this.curFinal.get( "regionDivision" )] )
		return A( [{
			value: [this.curFinal.get( "regionDivision" ), this.curFinal.get( "manageTeam" ), this.curFinal.get( "manageTime" ),
				this.curFinal.get( "resourceAssigns" ),this.curFinal.get( "targetAssigns" )],
			name: "能力分析"
		}] )
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
			}
		}
	}
} )
