const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema({
	// id:
    name: {type:'string', required: [true, 'no product name found']},
    description: {type:'string'},
    image: {type:'string'},
    status: {type: 'string', in: ['Active', 'InActive'], default: 'Active'}, // 'in' used to set the value to be these 2 values and default set to 'Active'
    categories : [{type : Schema.Types.ObjectId, ref : 'Category', childPath:"products"}] // making mamny to many association with category
}, {
    timestamps: true // this can helps mongoose to create createdAt and updatedAt fileds in each record
});

module.exports = mongoose.model('Product', ProductSchema);