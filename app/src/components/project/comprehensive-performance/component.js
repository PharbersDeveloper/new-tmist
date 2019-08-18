import Component from "@ember/component"

export default Component.extend( {
	classNames: ["performance-wrapper"],
	axisName: "区域能力划分",
	actions: {
		changeRadar( axisName ) {
			this.set( "axisName",axisName )
		}
	}
} )
