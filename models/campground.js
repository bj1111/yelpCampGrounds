const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')
const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [
        {
            url:String,
            filename:String,
        }
    ],
    author:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

campGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc.reviews.length)
    {
        await Review.deleteMany({
            _id : {$in: doc.reviews}
        })

    }
})

module.exports = mongoose.model('Campground',campGroundSchema);
