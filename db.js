const mongoose = require('mongoose');


const User = new mongoose.Schema({
  	username: {type: String, required: true, maxLength: 15},
  	hash: {type: String, required: true},
	categories: [String]
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


const mongooseOpts = {
    useNewUrlParser: true,  
    useUnifiedTopology: true,
};


mongoose.model('User', User);
mongoose.model('Category', Category);
mongoose.model('Spending', Spending);


if (process.env.DATABASE) { // deployment
	mongoose.connect(process.env.DATABASE, mongooseOpts, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('connected to database'); 
		}
	});

} else { // local
	if (process.env.username && process.env.password) {
		mongooseOpts.user = process.env.username;
		mongooseOpts.pass = process.env.password;
	}

	mongoose.connect('mongodb://localhost/spendingtrackerdb', mongooseOpts, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('connected to database'); 
		}
	});
}

