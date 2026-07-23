import User from "../models/user.model.js";


export const createUser = async (userData) => {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
}


export const findUserByEmail = async (email) => {
    return await User.findOne({ email })
}


export const findUserById = async (id) => {
    return await User.findById(id)
}


export const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
}