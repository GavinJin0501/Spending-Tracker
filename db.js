const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');


const User = new mongoose.Schema({
  username: {type: String, required: True, maxLength: 15},
  hash: {type: String},
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});


const Item = new mongoose.Schema({
	name: {type: String, required: true},
	quantity: {type: Number, min: 1, required: true},
	checked: {type: Boolean, default: false, required: true}
}, {
	_id: true
});


const Category = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
	createdAt: {type: Date, required: true},
	items: [Item]
});


User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('List', List);
mongoose.model('Item', Item);
mongoose.connect('mongodb://localhost/grocerydb');
