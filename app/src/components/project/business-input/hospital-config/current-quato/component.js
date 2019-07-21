import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["hospital", "product"],
	store: service(),
	currentQuato: computed( "hospital.presets", "product", async function() { // async 好像不好使 没时间调试
		let lst = this.hospital.presets.map( x => x.get( "id" ) )
		Promise.all( lst.map( element => {
			return this.store.findRecord( "model/preset", element )
		} ) ).then( lst => {
			const cur = lst.find( item => item.get( "product.id" ) === this.get( "product.id" ) )
			cur ? this.set("currentQuato", cur.potential) : 0
		})
	} ),
	curAchi: computed( "hospital.presets", "product", function() {
		let lst = this.hospital.presets.map( x => x.get( "id" ) )
		Promise.all( lst.map( element => {
			return this.store.findRecord( "model/preset", element )
		} ) ).then( lst => {
			const cur = lst.find( item => item.get( "product.id" ) === this.get( "product.id" ) )
			cur ? this.set("curAchi", cur.achievements ) : 0
		})
	} ),
	// async calQuato( lst ) {
	// 	return await Promise.all( lst.map( element => {
	// 		return this.store.findRecord( "model/preset", element )
	// 	} ) ).then( lst => {
	// 		console.log(1234)
	// 		console.log(lst)
	// 		const cur = lst.find( item => item.get( "product.id" ) === this.get( "product.id" ) )
	// 		console.log(cur)
	// 		return cur ? cur.potential : 0
	// 	})
	// }
} )
