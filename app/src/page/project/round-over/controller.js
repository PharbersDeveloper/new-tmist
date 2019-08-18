import Controller from "@ember/controller"
import { computed } from "@ember/object"

export default Controller.extend( {
	endTime: computed( "this.model.project", function () {
		let date = new Date( this.model.project.endTime ),
			y = date.getFullYear() + "-",
			m = ( date.getMonth() + 1 < 10 ? "0" + ( date.getMonth() + 1 ) : date.getMonth() + 1 ) + "-",
			d = date.getDate() + " ",
			h = ( date.getHours() + 1 < 10 ? "0" + date.getHours() : date.getHours() ) + ":",
			mins = date.getMinutes() + 1 < 10 ? "0" + date.getMinutes() : date.getMinutes(),
			time = y + m + d + h + mins

		return time
	} ),
	spendTime: computed( "this.model.project", function () {
		if ( this.model.project.endTime < this.model.project.startTime ) {
			return 0
		}

		let date = new Date( this.model.project.endTime - this.model.project.startTime ),
			h = date.getHours(),
			m = date.getMinutes()

		if ( h ) {

			return h + "时" + m + "分"
		} else {
			return m + "分"
		}
	} ),
	actions: {
		toIndex() {
			this.transitionToRoute( "/" )
		},
		toReport() {
			this.transitionToRoute( "page.project.result", this.model.project.id )
		}
	}
} )
