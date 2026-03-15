const ShopSettings = require("../models/ShopSettings");


// to add get setting and load save data 

const getSettings = async (req, res) => {
    try{

        const setting = await ShopSettings.findOne({user: req.user._id});

        if(!setting){
            return res.status(200).json({});  // to return empty setting 
        }

        res.status(200).json(settings);

    } catch (error){
        res.status(500).json({message: error.message});
    }
};

//   update the data and post the setting 

const saveSettings = async (req, res) => {
    try {
       const { ownerName, shopName, shopAddress, city, country, phone, email} = req.body;
    
        //  findone and update if exists update, if not create new 
        const settings = await ShopSettings.findOneAndUpdate(
            {user: req.user._id},
            {ownerName, shopName, shopAddress, city, country, phone, email},
            {new: true, upsert: true}   // upsert create if not found
        );

        res.status(200).json(settings);

    } catch (error){
        res.status(500).json({message: error.message});
    }
};


module.exports = { getSettings, saveSettings};