import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		toReport() {
			this.transitionToRoute( "page.project.report" )
		},
		toCongratulation() {
			this.transitionToRoute( "page.project.round-over" )
		},
		toNext() {
			// 创建新的周期并进入
		}
	}
} )
