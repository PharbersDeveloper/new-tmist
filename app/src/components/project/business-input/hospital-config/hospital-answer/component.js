import Component from '@ember/component';
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["hospital", "product", "exam"],
	currentAnswer: computed( "hospital", "product", "exam.bs.operationAnswers", function() { 
        const answers = this.exam.bs.operationAnswers
        if (answers) {
            const tmp = answers.find( item => {
                const hs = item.get( "target.id" ) === this.get( "hospital.id" ) 
                console.log(item.get("target.id"))
                console.log(this.get("hospital.id"))
                console.log(hs)
                const ps = item.get("product.id") === this.get("product.id")
                // console.log(ps)
                return hs && ps
            })
            console.log(`current answer ${tmp}`)
            return tmp
        } else {
            return null
        }
	} )
} )
