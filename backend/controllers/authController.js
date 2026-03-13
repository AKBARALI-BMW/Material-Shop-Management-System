const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// register new user 

const registerUser = async (req, res) => {
    try{
      const { name, shopName, email, mobile, password, confirmPassword } = req.body;

// validation
if (!name || !shopName || !email || !mobile || !password || !confirmPassword) {
  return res.status(400).json({ message: "All fields are required" });
}

if (password !== confirmPassword) {
  return res.status(400).json({ message: "Passwords do not match" });
}
        // check the users exists 
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }
        // create the user 
        const user = await User.create({name, shopName, email, mobile, password});

    
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            shopName: user.shopName,
            email: user.email,
            mobile: user.mobile,
           createdAt: user.createdAt,
          token: generateToken(user._id, user.email)
        });
    } else {
        res.status(400).json({message:"Invalid user data"});
    }
} catch (error){
    res.status(500).json({message: error.message});
}
  console.log(req.body); // check incoming data


};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public

const loginUser = async (req, res) => {
    try{
     const  {email, password} = req.body;

    //  validate fields 
    if(!email || !password){
        return res.status(400).json({message: "please provide email and password"});
    }

    // find user 
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "Invalid credentials"});
    }
    // check password 
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({message: "Invalid credentials"});
    }

    // create token 
    const token = jwt.sign(
        {id: user._id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    );
    
 

    res.status(200).json({
        _id: user._id,
        name: user.name,
        shopName: user.shopName,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id, user.email)
    });

  
 
    } catch (error){
        res.status(500).json({message: error.message});
    }
};



module.exports = {registerUser, loginUser};