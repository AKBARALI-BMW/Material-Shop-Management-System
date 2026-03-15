const mongoose = require("mongoose");

const shopSettingsSchema = new mongoose.Schema(
    {

    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    ownerName: {type: String, default: ""},
    shopName: {type: String, default: ""},
    ShopAddress: {type: String, default: ""},
    city: {type: String, default: ""},
    country: {type: String, default: ""},
    phone: {type: String, default: ""},
    email: {type: String, default: ""},
    profileImage: {type: String, default: ""},
},
{timestamps: true}
);

module.exports = mongoose.model("ShopSettings", shopSettingsSchema);