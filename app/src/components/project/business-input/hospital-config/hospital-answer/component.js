import Component from '@ember/component';
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["hospital", "product", "exam"],
	currentAnswer: computed( "hospital", "product", "exam.bs.operationAnswers", function() { 
        const answers = this.exam.bs.operationAnswers
        if (answers) {
            return answers.find( item => {
                const hs = item.get( "target.id" ) === this.get( "hospital.id" ) 
                const ps = item.get("product.id") === this.get("product.id")
                return hs && ps
            })
        } else {
            return null
        }
	} )
} )
