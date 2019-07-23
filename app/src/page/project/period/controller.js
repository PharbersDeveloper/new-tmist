import Controller from "@ember/controller"
// import ENV from "new-tmist/config/environment"
// import { computed } from "@ember/object"
import { isEmpty } from "@ember/utils"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default Controller.extend( {
	toast: service(),
	exam: service( "service/exam-facade" ),
	currentTab: 0,
	actions: {
		submit() {
			let judgeAuth = this.judgeOauth(),
				store = this.get( "store" ),
				representatives = store.peekAll( "representative" ),
				// 验证businessinputs
				// 在page-scenario.business 获取之后进行的设置.

				businessinputs = store.peekAll( "businessinput" )

			if ( isEmpty( judgeAuth ) ) {
				window.location = judgeAuth
				return
			}
			this.verificationBusinessinputs( businessinputs, representatives )
		},
		confirmSubmit() {
			this.set( "warning", { open: false } )
			this.set( "loadingForSubmit", true )

			this.sendInput( 3 )
		},
		saveInputs() {
			Ember.Logger.info( "save current input" )
			this.exam.saveCurrentBussinessInput( () => {
				alert( "save success" )
			} )
		},
		testResult() {
			this.toast.success( "", "保存成功", {
				closeButton: false,
				positionClass: "toast-top-center",
				progressBar: false,
				timeOut: "2000"
			} )
			// this.transitionToRoute('page-result');
		}
	}
} )
