const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = mongoose.Schema({
    name: {type:'string', unique: true, required: [true, 'no category name found']}, // here name should be unique (i.e., to avoid duplicate named categories)
    description: {type:'string', },
    status: {type: 'string', in: ['Active', 'InActive'], default: 'Active'}, // 'in' used to set the value to be these 2 values and default set to 'Active'
    products : [{type : Schema.Types.ObjectId, ref : 'Product'}] // making mamny to many association with products
}, {
    timestamps: true // this can helps mongoose to create createdAt and updatedAt fileds in each record
});

module.exports = mongoose.model('Category', CategorySchema);