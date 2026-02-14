import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";

const updateProfile = asyncHandler(async (req, res) => {
    const { full_name, phone, firm_name, address, country } = req.body;

    const user = await User.findOneAndUpdate(
        { email: req.user.email, role: req.user.role, username: req.user.username },
        {
            $set: {
                full_name,
                phone,
                firm_name,
                address,
                country
            }
        },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({
        success: true,
        data: user,
        message: "Profile updated successfully."
    });
});

export default updateProfile;
