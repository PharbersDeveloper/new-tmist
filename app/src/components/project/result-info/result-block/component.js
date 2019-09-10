import Component from "@ember/component"

export default Component.extend( {
	positionalParams: ["title", "cate", "results", "evaluations"],
	// classNames: ["mb-4", "bg-white"],
	detailInfo: null,

	didReceiveAttrs() {
		this._super( ...arguments )
		let tmp = {
			abilityLevel: "",
			levelDes: "",
			actionDes: "",
			abilityImg: ""
		}

		this.results.map( ele => {
			this.evaluations.map( elem => {
				if ( ele.category === this.cate && elem.category === this.cate ) {
					if ( ele.get( "awardLevel.rank" ) === elem.level ) {
						tmp.abilityLevel = ele.get( "awardLevel.rank" )
						tmp.levelDes = elem.levelDescription
						tmp.actionDes = elem.actionDescription
						tmp.abilityImg = ele.get( "awardLevel.rankImg" )
					}
				}
			} )
		} )

		window.console.log( tmp )

		this.set( "detailInfo", tmp )
	}
} )
