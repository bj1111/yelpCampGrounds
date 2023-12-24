const Campground = require('../models/campground')
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapbox = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapbox})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    // console.log(campgrounds);
    res.render('campgrounds/index', { campgrounds });

}

module.exports.newForm = (req, res) => {
    
    res.render('campgrounds/new');

}

module.exports.getCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
        path :'reviews',
        populate:'author'
    }).populate('author');
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground });

}

module.exports.createCamp = async (req, res, next) => {
    // if(!req.body.campground)
    const Geodata = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    
    // res.send("ok!!!!!!");
    
    
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f=>({url:f.path,filename: f.filename}));
    campground.geometry = Geodata.body.features[0].geometry

    campground.author = req.user._id
    console.log(campground)
    await campground.save();
    req.flash('success','successfully add a new camp ground')
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.getEditCamp =  async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error',`cant find the campground you are looking for`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });

}

module.exports.editCamp = async (req, res) => {
    
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f=>({url:f.path,filename: f.filename}))
    camp.images.push(...imgs);
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename)
        }
        await  camp.updateOne({$pull: {images : { filename : {$in: req.body.deleteImages}}}})

    }
    
    
    await camp.save();
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted  Campground!')
    res.redirect('/campgrounds');

}