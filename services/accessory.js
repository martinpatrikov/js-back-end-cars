const Accessory = require('../models/Accessory');

async function getAll(){
    return Accessory.find({}).lean();
}

async function createAccessory(accessory){
    const result = new Accessory(accessory);
    await result.save();
}

module.exports = () => (req, res, next) => {
    req.accessory = {
        createAccessory,
        getAll
    };
    
    next();
}

