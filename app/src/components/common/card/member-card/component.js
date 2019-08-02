import Component from "@ember/component"
import { computed } from "@ember/object"
import { A } from "@ember/array"
import { isEmpty } from "@ember/utils"

export default Component.extend( {
	positionalParams: ["resource"],
	classNames: ["mb-4"],
	localClassNames: "resource",
	showContent: false,
	icon: computed( "showContent", function () {
		let showContent = this.get( "showContent" )

		return showContent ? "right" : "down"
	} ),
	radarData: computed( "resourceId", function () {
		let averageAbilityObject =
			this.get( "averageAbility" ).get( "firstObject" ),
			resourceId = this.get( "resourceId" ),
			originalAbility = A( [] ),
			resourceAbilities = this.get( "resourceAbilities" ),
			reallyAbility = null

		if ( isEmpty( resourceId ) ) {
			return [
				{
					value: [0, 0, 0, 0, 0],
					name: "代表个人能力"
				},
				{
					value: averageAbilityObject,
					name: "团队平均能力"
				}
			]
		}
		resourceAbilities.forEach( ele => {
			if ( ele.get( "resource.id" ) === resourceId ) {
				reallyAbility = ele
			}
		} )

		if ( isEmpty( reallyAbility ) ) {
			originalAbility = [0, 0, 0, 0, 0]
		} else {

			originalAbility.push( reallyAbility.get( "jobEnthusiasm" ) )
			originalAbility.push( reallyAbility.get( "productKnowledge" ) )
			originalAbility.push( reallyAbility.get( "behaviorValidity" ) )
			originalAbility.push( reallyAbility.get( "regionalManagementAbility" ) )
			originalAbility.push( reallyAbility.get( "salesAbility" ) )
		}
		return [
			{
				value: originalAbility,
				name: "代表个人能力"
			},
			averageAbilityObject
		]
	} ),
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		}
	}
} )
