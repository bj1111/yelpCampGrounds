const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const campground = require('../models/campground');
const {places, descriptors} = require('./seedHelper')
mongoose.connect('mongodb://127.0.0.1:27017/camp-ground')
.then(()=>{
    console.log("MONGODB CONNECTED !!!!!!");

})
.catch(err =>{
    console.log("MONGODB CONNTECTION ERROR");
})

const giveName = (array) =>{
    return array[Math.floor(Math.random()*array.length)];
}

const dbSeeds = async () =>{
    await Campground.deleteMany({});
    for(let i = 0;i < 50;i++)
    {
        const random1000 = Math.floor((Math.random()*1000));
        const p = (Math.floor(Math.random()*20) + 10);
        const campNew = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${giveName(descriptors)} ${giveName(places)}`,
            image : 'https://source.unsplash.com/random?woods',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, fuga quisquam necessitatibus enim eum totam, architecto, sequi reiciendis laboriosam mollitia voluptas. Natus voluptatibus hic neque eos rem cumque, quas incidunt.',
            price : p

        })
        await campNew.save();

    }
}
dbSeeds().then(()=> mongoose.connection.close());