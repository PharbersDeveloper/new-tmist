import Component from '@ember/component'
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'

export default Component.extend({
    positionalParams: ["hospital", "product"], 
    store: service(),
    currentQuato: computed("hospital.presets", "product", function() {
        let lst = this.hospital.presets.map (x => x.get("id"))
        Promise.all(lst.map(element => {
            return this.store.findRecord("model/preset", element)
        })).then(lst=> lst.forEach(item => {
                if (item.get("product.id") === this.get("product.id")) {
                    this.set("currentQuato", item.potential)
                }
            })
        )
    }),
    curAchi: computed("hospital.presets", "product", function() {
        let lst = this.hospital.presets.map (x => x.get("id"))
        Promise.all(lst.map(element => {
            return this.store.findRecord("model/preset", element)
        })).then(lst=> lst.forEach(item => {
                if (item.get("product.id") === this.get("product.id")) {
                    this.set("curAchi", item.achievements)
                }
            })
        )
    })
});
