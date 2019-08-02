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
	validation() {
		window.console.log( this.model.project.proposal.get( "quota.totalBudget" ) )
		let curerntBudget = 0,
			currentSalesTarget = 0,
			currentMeetingPlaces = 0,
			aResources = {}, // 被分配的resource
			freeResource = [], // 没有分配的resource
			currentManagementTime = 0,
			hospitalWithoutMeetingPlaces = [],
			hospitalWithoutResource = [],
			hospitalWithoutBudgetOrSales = [],
			allBudget = this.model.project.proposal.get( "quota.totalBudget" ),
			allSalesTarget = this.model.project.proposal.get( "quota.totalQuotas" ),
			allMeetingPlaces = this.model.project.proposal.get( "quota.meetingPlaces" ),
			allManagementTime = 100

		//budget validation
		this.model.answers.forEach( answer => {
			if ( answer.get( "category" ) === "Management" ) {
				let strategAnalysisTime = Number( answer.get( "strategAnalysisTime" ) ),
					clientManagementTime = Number( answer.get( "clientManagementTime" ) ),
					adminWorkTime = Number( answer.get( "adminWorkTime" ) ),
					kpiAnalysisTime = Number( answer.get( "kpiAnalysisTime" ) ),
					teamMeetingTime = Number( answer.get( "teamMeetingTime" ) )

				currentManagementTime = strategAnalysisTime === -1 ? currentManagementTime : currentManagementTime + strategAnalysisTime
				currentManagementTime = clientManagementTime === -1 ? currentManagementTime : currentManagementTime + clientManagementTime
				currentManagementTime = adminWorkTime === -1 ? currentManagementTime : currentManagementTime + adminWorkTime
				currentManagementTime = kpiAnalysisTime === -1 ? currentManagementTime : currentManagementTime + kpiAnalysisTime
				currentManagementTime = teamMeetingTime === -1 ? currentManagementTime : currentManagementTime + teamMeetingTime

			} else if ( answer.get( "category" ) === "Management" ) {
				let abilityCoach = Number( answer.get( "abilityCoach" ) ),
					assistAccessTime = Number( answer.get( "assistAccessTime" ) )

				currentManagementTime = abilityCoach === -1 ? currentManagementTime : currentManagementTime + abilityCoach
				currentManagementTime = assistAccessTime === -1 ? currentManagementTime : currentManagementTime + assistAccessTime

			} else if ( answer.get( "category" ) === "Business" ) {
				// 有医院未被分配代表
				if ( answer.get( "meetingPlaces" ) === -1 ) {
					hospitalWithoutMeetingPlaces.push( answer.get( "target.name" ) )
				}

				if ( !answer.get( "resource" ) ) {
					hospitalWithoutResource.push( answer.get( "target.name" ) )
				}
 				if ( !( answer.resource.get( "id" ) in aResources ) ) {
					aResources[answer.resource.get( "id" )] = 0
				}
				let visitTime = Number( answer.get( "visitTime" ) ),
					budget = Number( answer.get( "budget" ) ),
					salesTarget = Number( answer.get( "salesTarget" ) ),
					meetingPlaces = Number( answer.get( "meetingPlaces" ) )

				aResources[answer.resource.get( "id" )] = visitTime === -1 ? aResources[answer.resource.get( "id" )] : aResources[answer.resource.get( "id" )] + visitTime
				aResources[answer.resource.get( "id" )] = budget === -1 ? aResources[answer.resource.get( "id" )] : aResources[answer.resource.get( "id" )] + budget
				aResources[answer.resource.get( "id" )] = salesTarget === -1 ? aResources[answer.resource.get( "id" )] : aResources[answer.resource.get( "id" )] + salesTarget
				aResources[answer.resource.get( "id" )] = meetingPlaces === -1 ? aResources[answer.resource.get( "id" )] : aResources[answer.resource.get( "id" )] + meetingPlaces

			}
		} )
		this.model.resources.forEach( resource => {
			if ( !( resource.id in aResources ) ) {
				freeResource.push( resource )
			}
		} )

		if ( currentManagementTime < allManagementTime ) {
			// 经理时间未达标
			this.set( "validationWarning", {
				open: true,
				title: "未达标",
				detail: "请完成经理的管理时间分配。"
			} )
		} else if ( currentManagementTime > allManagementTime ) {
			// 经理时间超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超额",
				detail: "经理时间设定已超过限制，请重新分配。"
			} )
		} else if ( curerntBudget < allBudget ) {
			// 预算未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "您还有总预算剩余，请分配完毕。"
			} )
		} else if ( curerntBudget > allBudget ) {
			// 预算超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的预算设定总值已超出总预算限制，请合理分配。"
			} )
		} else if ( currentSalesTarget < allSalesTarget ) {
			// 销售额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "您的业务销售额指标尚未完成，请完成指标。"
			} )
		} else if ( curerntBudget > allSalesTarget ) {
			// 销售额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的销售额指标设定已超额，请合理分配。"
			} )
		} else if ( currentMeetingPlaces < allMeetingPlaces ) {
			// 会议名额未达标
			this.set( "validationWarning", {
				open: true,
				title: "设定未达标",
				detail: "您还有会议名额剩余，请分配完毕。"
			} )
		} else if ( currentMeetingPlaces > allMeetingPlaces ) {
			// 会议名额超标
			this.set( "validationWarning", {
				open: true,
				title: "设定超标",
				detail: "您的会议名额设定已超过总名额限制，请合理分配"
			} )
		} else if ( hospitalWithoutMeetingPlaces.lenth > 0 ){
			// 有医院 名额未被分配
			this.set( "validationWarning", {
				open: true,
				title: "达标，但有医院名额有空状态，医院状态处于未分配。",
				detail: `请为${hospitalWithoutMeetingPlaces[0]}设定会议名额，若不分配，请输入值“0”`
			} )
		} else if ( hospitalWithoutResource.length > 0 ) {
			// 有医院没有分配代表
			this.set( "validationWarning", {
				open: true,
				title: "有医院未分配代表",
				detail: `尚未对${hospitalWithoutResource[0]}进行代表分配，请为其分配代表`
			} )
		} else if ( freeResource.length ) {
			// 有代表未被分配
			let name = freeResource[0].name

			this.set( "validationWarning", {
				open: true,
				title: "有代表未被分配到医院",
				detail: `尚未对${name}分配工作，请为其分配。`
			} )
		} else {
			// 代表时间有剩余
			for ( let key in aResources ) {
				if ( aResources[key] !== 100 ) {
					let name = this.resources.filter( r => {
						if ( r.id === key ) {
							return r.name
						}
					} )

					this.set( "validationWarning", {
						open: true,
						title: "有剩余时间未分配",
						detail: `${name}还有剩余时间未被分配，请合理分配。`
					} )
				}
			}
		}
	},
	actions: {
		submit() {
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
			this.transitionToRoute( "page.project.result" )
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
