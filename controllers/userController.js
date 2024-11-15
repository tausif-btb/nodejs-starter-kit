import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_ACCESS_KEY, {expiresIn: process.env.ACCESS_KEY_EXPIRES_IN})
};

const generateRefreshToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_REFRESH_KEY, {expiresIn: process.env.REFRESH_KEY_EXPIRES_IN})
}

const signupUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        const user = await userModel.findOne({ email: email })

        if (user) {
            return res.status(400).json({ "status": "failed", "message": "User already exists" })
        } else {
            if (name && email && password && confirmPassword) {

                const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.{8,})/.test(password);
                if (!isValidPassword) {
                    return res.status(400).json({ "status": "failed", "message": "Password must have least 8 characters,include uppercase, lowercase, digit, and special character" });
                }

                if (password === confirmPassword) {

                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt);
                    const doc = new userModel({
                        name: name,
                        email: email,
                        password: hashPassword,
                    });

                    await doc.save();

                    const savedUser = await userModel.findOne({ email: email });
                    const accessToken = generateAccessToken(savedUser._id);
                    const refreshToken = generateRefreshToken(savedUser._id);
                    // const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

                    savedUser.refreshToken = refreshToken;
                    await savedUser.save();

                    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});

                    res.status(200).send({ "status": "success", "message": "User registered successfully", "token": accessToken })

                }
                else {
                    res.status(400).json({ "status": "failed", "message": "Password and confirm password must be same" })
                }
            }
            else {
                res.status(400).json({ "status": "failed", "message": "All fields are mandatory" })
            }
        }

    } catch (error) {
        res.status(500).json({ "status": "failed", "message": "Error occured" })
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email && password) {
            const user = await userModel.findOne({ email: email });
            if (user != null) {
                const isPassMatch = await bcrypt.compare(password, user.password)
                if ((user.email === email) && isPassMatch) {
                    // const secret = user._id + process.env.JWT_SECRET_KEY
                    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

                    const accessToken = generateAccessToken(user._id);
                    const refreshToken = generateRefreshToken(user._id);

                    user.refreshToken = refreshToken;
                    await user.save();

                    res.cookie('refreshToken' , refreshToken, {httpOnly: true, secure : true})

                    res.status(200).json({
                        "status": "success", "message": "Login Successfull", "Acess token": accessToken,
                        "user": {
                            "id": user._id,
                            "name": user.name,
                            "email": user.email,
                            "refreshToken" : user.refreshToken,
                        }
                    })
                }
                else {
                    res.status(400).json({ "status": "failed", "message": "Email/Password is not valid" })
                }

            } else {
                res.status(400).json({ "status": "failed", "message": "User not registered" })
            }
        }
        else {
            res.status(400).json({ "status": "failed", "message": "All fields are mandatory" });
        }

    } catch (error) {
        res.status(500).json({ "status": "failed", "message": "Error occured" })
    }

}

const refreshToken = async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(403).json({"status": "failed", "message":"Refresh Token not found"})
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async(err, decoded) =>{
        if(err){
            return res.status(403).json({"status":"failed", "message":"Invalid Refresh Token"})
        }
        const user = await userModel.findOne({_id:decoded.userId});
        if(!user || user.refreshToken !== refreshToken){
            return res.status(403).json({"status":"failed", "message":"Invalied User for Refresh token"})
        }

        const newAccessToken = generateAccessToken(user._id);
        res.status(200).json({"status":"success", "Access token":newAccessToken})
    });
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.userId }).select("-password");
        if (user) {
            res.status(200).json({ "status": "Profile fetched successfully", user })
        } else {
            res.status(404).json({ "status": "failed", "message": "User not found" })
        }

    } catch (error) {
        res.status(500).json({ "status": "failed", "message": "server error" })
    }
}


export { signupUser, loginUser, getProfile, refreshToken};
