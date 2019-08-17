import Component from "@ember/component"

export default Component.extend( {
	positionalParams: ["proposol", "project", "hospitals", "resources", "products", "answers"],
	curDecisionReview: 0,
	classNames: ["review-wrapper"]
} )
