const ShopSettings = require("../models/ShopSettings");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with user ID and timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `logo-${req.user._id}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// to add get setting and load save data

const getSettings = async (req, res) => {
    try{

        const setting = await ShopSettings.findOne({user: req.user._id});

        if(!setting){
            return res.status(200).json({});  // to return empty setting
        }

        // Add full URL for logo if it exists
        const responseData = { ...setting.toObject() };
        if (setting.profileImage) {
            responseData.profileImage = `${req.protocol}://${req.get('host')}/uploads/${setting.profileImage}`;
        }

        res.status(200).json(responseData);

    } catch (error){
        res.status(500).json({message: error.message});
    }
};

//   update the data and post the setting 

const saveSettings = async (req, res) => {
    try {
       const { ownerName, shopName, shopAddress, city, country, phone, email} = req.body;
    
       // Prepare update data
       const updateData = { ownerName, shopName, shopAddress, city, country, phone, email };

       // Handle logo upload if file is provided
       if (req.file) {
           updateData.profileImage = req.file.filename;

           // Optionally delete old logo file if it exists
           const existingSetting = await ShopSettings.findOne({ user: req.user._id });
           if (existingSetting && existingSetting.profileImage) {
               const oldLogoPath = path.join(uploadsDir, existingSetting.profileImage);
               if (fs.existsSync(oldLogoPath)) {
                   fs.unlinkSync(oldLogoPath);
               }
           }
       }

        //  findone and update if exists update, if not create new 
     const settings = await ShopSettings.findOneAndUpdate(
  { user: req.user._id },
  updateData,
  { returnDocument: "after", upsert: true }   // ← replace new:true with returnDocument:'after'
  );

        // Add full URL for logo in response
        const responseData = { ...settings.toObject() };
        if (settings.profileImage) {
            responseData.profileImage = `${req.protocol}://${req.get('host')}/uploads/${settings.profileImage}`;
        }

        res.status(200).json(responseData);

    } catch (error){
        res.status(500).json({message: error.message});
    }
};


module.exports = { getSettings, saveSettings, upload };