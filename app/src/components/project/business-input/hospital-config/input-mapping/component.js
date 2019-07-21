import Component from '@ember/component';
import groupBy from 'ember-group-by';
import { computed } from "@ember/object"

export default Component.extend({
	positionalParams: ["proposal", "exam"],
    // currentQuato: computed( "proposal.presets", "hospital", "product", function() { // async 好像不好使 没时间调试
	// 	let lst = this.proposal.get("presets")//.map( x => x.get( "id" ) )
	// 	// Promise.all( lst.map( element => {
	// 		// return this.store.findRecord( "model/preset", element )
	// 	// } ) ).then( lst => {
	// 		const cur = lst.find( item => {
	// 			const pc = item.get( "product.id" ) === this.get( "product.id")
	// 			const hc = item.get( "hospital.id" ) === this.get( "hospital.id")
	// 			return pc && hc
	// 		})
	// 		// return cur ? this.set("currentQuato", cur.potential) : 0
	// 		return cur ? cur.potential : 0
	// 	// })
	// } ),
	// curAchi: computed( "proposal.presets", "hospital", "product", function() { // async 好像不好使 没时间调试
	// 	let lst = this.proposal.get("presets")//.map( x => x.get( "id" ) )
	// 	// Promise.all( lst.map( element => {
	// 		// return this.store.findRecord( "model/preset", element )
	// 	// } ) ).then( lst => {
	// 		const cur = lst.find( item => {
	// 			const pc = item.get( "product.id" ) === this.get( "product.id")
	// 			const hc = item.get( "hospital.id" ) === this.get( "hospital.id")
	// 			return pc && hc
	// 		})
	// 		// return cur ? this.set("curAchi", cur.achievements) : 0
	// 		return cur ? cur.achievements: 0
	// 	// })
	// } ),
	// currentAnswer: computed( "hospital", "product", "exam.bs.operationAnswers", function() { 
    //     const answers = this.exam.bs.operationAnswers
    //     if (answers) {
    //         return answers.find( item => {
    //             const hs = item.get( "target.id" ) === this.get( "hospital.id" ) 
    //             const ps = item.get("product.id") === this.get("product.id")
    //             return hs && ps
    //         })
    //     } else {
    //         return null
    //     }
    // } ),
    p: groupBy("proposal.presets", "hospital"),
    // a: groupBy("exam.bs.operationAnswers", "hospital.id"),
    res: computed( "p", "exam.bs.operationAnswers", function() {
        if (this.p && this.exam.bs.operationAnswers) {
            return this.p.map(item => {
                const result = item.items.map(preset => {
                    const answer = this.exam.bs.operationAnswers.find(ans => {
                        const ts = ans.get("target.id") === preset.get("hospital.id")
                        const ps = ans.get("product.id") === preset.get("product.id")
                        return ts && ps
                    })
                    return { preset: preset,  answer: answer}
                })
                return { hospital: item.value, quizs: result }
            })
        } else {
            return []
        }
    })
});
