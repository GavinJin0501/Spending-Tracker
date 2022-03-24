const mongoose = require('mongoose');
// const URLSlugs = require('mongoose-url-slugs');
// const passportLocalMongoose = require('passport-local-mongoose');


const User = new mongoose.Schema({
  	username: {type: String, required: true, maxLength: 15},
  	hash: {type: String, required: true},
  	categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]
});


const Spending = new mongoose.Schema({
	date: {type: Date, required: true},
	amount: {type: Number, required: true},
	notes: {type: String, maxLength: 50}
});


const Category = new mongoose.Schema({
  	user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
  	name: {type: String, required: true},
  	spendings: [Spending]
});


// User.plugin(passportLocalMongoose);
// List.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('Category', Category);
mongoose.model('Spending', Spending);
mongoose.connect('mongodb://localhost/spendingtrackerdb');

