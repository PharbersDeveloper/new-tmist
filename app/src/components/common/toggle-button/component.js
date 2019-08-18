import Component from "@ember/component"
import { A } from "@ember/array"
import { computed } from "@ember/object"

export default Component.extend( {
	tagName: "span",
	classNames: ["text-center"],
	localClassNames: "toggle-button",
	localClassNameBindings: A( ["choosed"] ),
	// choosed: equal('state', true),
	choosed: computed( "state", function () {
		let state = this.get( "state" )

		// if ( state === 1 || Boolean( state ) ) {
		if ( state === 1 ) {
			return true
		}
		return false
	} ),
	click() {
		let action = this.get( "changeState" ),
			disabled = this.get( "disabled" ),
			state = this.get( "state" )


		// 如果 disalbed 为true，说明 超出。只有state 为true的点击有效
		if ( !disabled || disabled && Boolean( state ) ) {
			// action(this.get('context'), this.get('key'));

			if ( state === 1 ) {
				this.set( "state", -1 )
				action()
			} else {
				this.set( "state", 1 )
				let changedOK = action()

				if ( !changedOK ) {
					this.set( "state", -1 )
				}
			}

		}
	},
	changeState() { }
} )
