import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		toOffWeb() {
			// console.info(location)
			// window.location.replace("http://www.pharbers.com")
			window.location = "https://www.pharbers.com"
		}
	}
} )
