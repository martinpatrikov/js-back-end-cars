const { Schema, model } = require('mongoose');

const carSchema = new Schema({
	name: {type: String},
	decription: {type: String, minlength: 20},
    imageUrl: {type: String},
    price: {type: Number}
});

const Car = model('Car', carSchema);

module.exports = Car;