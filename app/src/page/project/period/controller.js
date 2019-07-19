import Controller from "@ember/controller"
import ENV from "new-tmist/config/environment"
import { computed } from "@ember/object"
import { isEmpty } from "@ember/utils"
import { inject as service } from "@ember/service"

export default Controller.extend( {
	toast: service(),
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
			this.set( "confirmSubmit", false )

			let judgeAuth = this.judgeOauth()

			if ( isEmpty( judgeAuth ) ) {
				window.location = judgeAuth
				return
			}
			this.sendInput( 1 )
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
