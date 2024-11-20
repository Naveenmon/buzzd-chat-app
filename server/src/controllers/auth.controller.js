import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utlis.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try{
        //hashing password
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        if(!password || password.length < 6){
            return res.status(400).json({ message: "Password should be atleast 6 characters long" });
        }

        const user = await User.findOne ({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser){
            //generate jwt token
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials"})
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id:user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log("Error in Login controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Logout error in controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: "Please add a profile picture" });
        }

        const uploadResponse = await cloudinary. uploader.upload(profilePic, {
            folder: "chat",
            resource_type: "image",
        })
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, { new: true });

        res.status(200).json({updatedUser})

    } catch (error) {
        console.log("Error in update profile controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}