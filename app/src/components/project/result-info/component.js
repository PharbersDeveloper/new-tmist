import Component from "@ember/component"
import { computed } from "@ember/object"
// import ENV from 'new-tmist/config/environment';

export default Component.extend( {
	positionalParams: ["project", "results", "evaluations"],
	// overallInfo: computed(results function () {

	// } ),
	overallInfo: null,
	didReceiveAttrs() {
		this._super(...arguments);
		let tmpOverall = {
			abilityLevel: "",
			abilityDes: "",
			abilityImg: "",
			awardLevel: "",
			awardDes: "",
			awardImg: ""
		}

		this.results.map( ele => {
			this.evaluations.map( elem => {
				if ( ele.category === "Overall" && elem.category === "Overall" ) {
					if ( ele.get( "awardLevel.rank" ) === elem.level ) {
						tmpOverall.abilityLevel = ele.get( "awardLevel.rank" )
						tmpOverall.abilityDes = elem.abilityDescription
						tmpOverall.abilityImg = ele.abilityLevel.get( "rankImg" )
					}
					if ( ele.get( "awardLevel.rank" ) === elem.level ) {
						tmpOverall.awardLevel = ele.get( "awardLevel.rank" )
						tmpOverall.awardDes = elem.awardDescription
						tmpOverall.awardImg = ele.abilityLevel.get( "awardImg" )
					}
				}
			} )
		} )

		this.set( "overallInfo", tmpOverall )
	},
	actions: {
		toReport() {
			this.transitionToReport()
		},
		toIndex() {
			window.location = "/welcome"
		}
	}
} )
