import Controller from "@ember/controller"
// import ENV from "new-tmist/config/environment"
// import { computed } from "@ember/object"
// import { isEmpty } from "@ember/utils"
import { A } from "@ember/array"
import { computed, set } from "@ember/object"
import { inject as service } from "@ember/service"
import Ember from "ember"
// import { threadId } from "worker_threads"

export default Controller.extend( {
	toast: service(),
	exam: service( "service/exam-facade" ),
	em: service( "emitter" ),
	client: computed( function () {
		return this.em.GetInstance()
	} ),

	currentTab: 0,
	allProductInfo: computed( function() {
		// allProductInfo include product-id, product-cur-budget, product-cur-sales, product-all-sales
		let arr = []

		this.model.products.forEach( product => {
			if ( product.productType === 0 ) {
				let obj = {}

				obj.name = product.name
				obj.productId = product.id
				obj.allSales = 0
				obj.curSales = 0

				this.model.presets.forEach( preset => {
					if ( preset.get( "product.id" ) === product.id ) {
						obj.allSales += this.transNumber( preset.salesQuota )
					}
				} )

				this.model.answers.forEach( answer => {
					if ( answer.get( "product.id" ) === product.id ) {
						obj.curSales += this.transNumber( answer.get( "salesTarget" ) )
					}
				} )

				arr.push( obj )
			}
		} )
		return A( arr )
	} ),
	onMessage( msg ) {
		window.console.info( "Emitter Controller" )
		window.console.info( msg.channel + " => " + msg.asString() )
	},
	Subscribe() {
		window.console.info( "emitter" )
		// 获取Client Instance
		// let client = this.em.GetInstance()
		// API: 参照https://emitter.io/develop/javascript/
		// 订阅  参数：channel key，channel name，消息类型（message, error, disconnect），MessageHandel
		this.client.Subscribe( "XsKflXovpPuCKy4rGlioYVC7h6N1uutu", "tm/", "message", this.onMessage )
	},
	transNumber( input ) {
		let number = Number( input )

		if ( number === -1 || isNaN( number ) ) {
			return 0
		} else {
			return number
		}
	},
	validation() {
		let curerntBudget = 0,
			isOverSalesTarget = 0,
			overSalesTargetName = "",
			currentMeetingPlaces = 0,
			currentManagementTime = 0,
			resourceWithLeftTime = [],
			freeResource = [], // 没有分配的resource
			aResources = {}, // 被分配的resource
			// currentManagementPoint = 0,
			// hospitalWithoutMeetingPlaces = [],
			// hospitalWithoutResource = [],
			// hospitalWithoutBudgetOrSales = [],
			// allManagementPoint = this.model.project.proposal.get( "quota.managerKpi" )
			allBudget = this.model.project.proposal.get( "quota.totalBudget" ),
			// allSalesTarget = this.model.project.proposal.get( "quota.totalQuotas" ),
			allMeetingPlaces = this.model.project.proposal.get( "quota.meetingPlaces" ),
			allManagementTime = this.model.project.proposal.get( "quota.mangementHours" )


		this.allProductInfo.forEach( p => {
			if ( p.curSales > p.allSales ) {
				// 1 over
				set( this, isOverSalesTarget, 1 )
			} else if ( p.curSales < p.allSales ) {
				// 2 is not enough
				set( this, isOverSalesTarget, 2 )
				overSalesTargetName = p.name
			}
		} )

		//budget validation
		this.model.answers.forEach( answer => {
			if ( answer.get( "category" ) === "Management" ) {

				currentManagementTime += this.transNumber( answer.get( "strategAnalysisTime" ) )
				currentManagementTime += this.transNumber( answer.get( "clientManagementTime" ) )
				currentManagementTime += this.transNumber( answer.get( "adminWorkTime" ) )
				currentManagementTime += this.transNumber( answer.get( "kpiAnalysisTime" ) )
				currentManagementTime += this.transNumber( answer.get( "teamMeetingTime" ) )

			} else if ( answer.get( "category" ) === "Resource" ) {


				currentManagementTime += this.transNumber( answer.get( "abilityCoach" ) )
				currentManagementTime += this.transNumber( answer.get( "assistAccessTime" ) )

			} else if ( answer.get( "category" ) === "Business" ) {
				// 有医院未被分配会议名额
				// if ( answer.get( "meetingPlaces" ) === -1 ) {
				// 	hospitalWithoutMeetingPlaces.push( answer.get( "target.name" ) )
				// }
				// 有医院未分配销售额和预算
				// if ( answer.get( "budget" === -1 || answer.get( "salesTarget" ) === -1 ) ) {
				// 	hospitalWithoutBudgetOrSales.push( answer )
				// }
				// 有医院未被分配代表
				// if ( !answer.get( "resource" ) ) {
				// 	hospitalWithoutResource.push( answer.get( "target.name" ) )
				// }
				currentMeetingPlaces += this.transNumber( answer.get( "meetingPlaces" ) )
				curerntBudget += this.transNumber( answer.get( "budget" ) )
				// currentSalesTarget += this.transNumber( answer.get( "salesTarget" ) )
				// 不同药品销售额可能分开？

				if ( answer.resource.get( "id" ) ) {
					window.console.log( this.transNumber( answer.get( "visitTime" ) ) )

					if ( answer.resource.get( "id" ) in aResources ) {
						aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
					} else {
						aResources[answer.resource.get( "id" )] = 0
						aResources[answer.resource.get( "id" )] += this.transNumber( answer.get( "visitTime" ) )
					}

				}
			}
		} )
		this.model.resources.forEach( resource => {
			if ( !( resource.get( "id" ) in aResources ) ) {
				freeResource.push( resource )
			}

			// if ( resource.get( "totalTime" ) !== 0 ) {
			// 	resourceWithLeftTime.push( resource.get( "name" ) )
			// }
		} )

		for ( let key in aResources ) {
			if ( aResources[key] < 100 ) {
				this.model.resources.forEach( resource => {
					if ( resource.get( "id" ) === key ) {
						resourceWithLeftTime.push( resource )
					}
				} )
			}
		}

		if ( currentManagementTime < allManagementTime ) {
			// 经理时间未达标
			this.set( "validationWarning", {
				open: true,
				title: "未达标",
				detail: "请完成经理的管理时间分配。"
			} )
			return false
		} else if ( currentManagementTime > allManagementTime ) {
			// 经理时间超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超额",
				detail: "经理时间设定已超过限制，请重新分配。"
			} )
			return false
		} else if ( curerntBudget < allBudget ) {
			// 预算未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "总预算尚未完成分配，请分配完毕."
			} )
			return false
		} else if ( curerntBudget > allBudget ) {
			// 预算超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的预算设定总值已超出总预算限制，请合理分配。"
			} )
			return false
		} else if ( isOverSalesTarget === 2 ) {
			// 销售额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: `${overSalesTargetName}销售指标尚未完成分配，请完成指标分配。`
			} )
			return false
		} else if ( isOverSalesTarget === 1 ) {
			// 销售额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的销售指标设定总值已超出业务总指标限制，请合理分配。"
			} )
			return false
		} else if ( currentMeetingPlaces < allMeetingPlaces ) {
			// 会议名额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "您还有会议名额剩余，请分配完毕。"
			} )
			return false
		} else if ( currentMeetingPlaces > allMeetingPlaces ) {
			// 会议名额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的会议名额设定已超过总名额限制，请合理分配"
			} )
			return false
		} else if ( freeResource.length ) {
			// 有代表未被分配
			let name = freeResource[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有代表未被分配到医院",
				detail: `尚未对${name}分配工作，请为其分配。`
			} )
			return false
		} else if ( resourceWithLeftTime.length ) {
			// 代表时间有剩余
			window.console.log( aResources )
			window.console.log( resourceWithLeftTime )
			let name = resourceWithLeftTime[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有剩余时间未分配",
				detail: `${name}还有剩余时间未被分配，请合理分配。`
			} )
			return false
		} else {
			return true
		}

		// else if ( hospitalWithoutMeetingPlaces.lenth > 0 ){
		// 	// 有医院 名额未被分配
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "达标，但有医院名额有空状态，医院状态处于未分配。",
		// 		detail: `请为${hospitalWithoutMeetingPlaces[0]}设定会议名额，若不分配，请输入值“0”`
		// 	} )
		// } else if ( hospitalWithoutResource.length > 0 ) {
		// 	// 有医院没有分配代表
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配代表",
		// 		detail: `尚未对${hospitalWithoutResource[0]}进行代表分配，请为其分配代表`
		// 	} )
		// } else if ( hospitalWithoutBudgetOrSales.length > 0 ) {
		// 	this.set( "validationWarning", {
		// 		open: true,
		// 		title: "有医院未分配资源",
		// 		detail: `尚未对${hospitalWithoutBudgetOrSales[0]}进行资源分配，请为其分配资源`
		// 	} )
		// }

	},
	actions: {
		publish() {
			this.client.Publish( "XsKflXovpPuCKy4rGlioYVC7h6N1uutu", "tm/", "Hello" )
		},
		toIndex() {
			this.transitionToRoute( "page.welcome" )
		},
		submit() {
			let state = this.validation()

			if ( state ) {
				alert( "ok" )
				Ember.Logger.info( "save current input" )
				this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
					alert( "save success" )
					// this.transitionToRoute( "page.project.result" )
				} )
			}
			// let judgeAuth = this.judgeOauth(),
			// 	store = this.get( "store" ),
			// 	representatives = store.peekAll( "representative" ),
			// 	// 验证businessinputs
			// 	// 在page-scenario.business 获取之后进行的设置.

			// 	businessinputs = store.peekAll( "businessinput" )

			// if ( isEmpty( judgeAuth ) ) {
			// 	window.location = judgeAuth
			// 	return
			// }
			// this.verificationBusinessinputs( businessinputs, representatives )

			// validation
			// this.validation()

			// Ember.Logger.info( "save current input" )
			// this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
			// 	this.transitionToRoute( "page.project.report" )
			// } )
			// this.transitionToRoute( "page.project.result" )
		},
		confirmSubmit() {
			this.set( "warning", { open: false } )
			this.set( "loadingForSubmit", true )

			this.sendInput( 3 )
		},
		saveInputs() {
			Ember.Logger.info( "save current input" )
			this.exam.saveCurrentInput( this.model.period, this.model.answers, () => {
				alert( "save success" )
			} )
		},
		// testResult() {
		// 	this.toast.success( "", "保存成功", {
		// 		closeButton: false,
		// 		positionClass: "toast-top-center",
		// 		progressBar: false,
		// 		timeOut: "2000"
		// 	} )
		// 	// this.transitionToRoute('page-result');
		// },
		testReport() {
			this.transitionToRoute( "page.project.report" )
		},
		testResult() {
			this.transitionToRoute( "page.project.result" )
		}
	}
} )
