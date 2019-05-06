import DS from 'ember-data';

export default DS.Transform.extend({
	deserialize(serialized) {
		if (serialized === -9999) {
			return '';
		}
		return serialized;
	},

	serialize(deserialized) {
		if (deserialized === '') {
			return Number(-9999);
		}
		return Number(deserialized);
	}
});
