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
					if ( ele.abilityLevel === elem.level ) {
						tmpOverall.abilityLevel = ele.abilityLevel
						tmpOverall.abilityDes = elem.abilityDescription
						tmpOverall.abilityImg = ele.abilityImg
					}
					if ( ele.awardLevel === elem.level ) {
						tmpOverall.awardLevel = ele.awardLevel
						tmpOverall.awardDes = elem.awardDescription
						tmpOverall.awardImg = ele.awardImg
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
