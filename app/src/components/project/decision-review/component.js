import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers", "period"],
	curDecisionReview: 0,
	classNames: ["review-wrapper"],
	time: computed( "project", function () {
		let date = new Date( this.project.startTime ),
			y = date.getFullYear() + "-",
			m = ( date.getMonth() + 1 < 10 ? "0" + ( date.getMonth() + 1 ) : date.getMonth() + 1 ) + "-",
			d = date.getDate() + " ",
			h = ( date.getHours() + 1 < 10 ? "0" + date.getHours() : date.getHours() ) + ":",
			mins = date.getMinutes() + 1 < 10 ? "0" + date.getMinutes() : date.getMinutes(),
			time = y + m + d + h + mins

		return time
	} )
} )
