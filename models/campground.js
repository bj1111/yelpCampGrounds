const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')
const ImagesSchema = new Schema(
    {
        url:String,
        filename:String
    }
)
ImagesSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200')
})
const opts = { toJSON :{virtuals: true}}
const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    geometry: {
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    images: [
        ImagesSchema  
    ],
    location:{
        type:String,
        required:true
    },

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
},opts);

campGroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})



campGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc.reviews.length)
    {
        await Review.deleteMany({
            _id : {$in: doc.reviews}
        })

    }
})

module.exports = mongoose.model('Campground',campGroundSchema);
