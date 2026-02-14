
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Question from "./models/Question.js";

dotenv.config();

const dummyUsers = [
    {
        username: "ramesh_farmer",
        email: "ramesh@example.com",
        phone: "9876543210",
        country: "India",
        address: "Village Plot 42, Punjab",
        full_name: "Ramesh Singh",
        password: "password123", // Will be stored as plain for dummy
        role: "user",
        firm_name: "Singh Organic Farms",
        profile_pic: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=200&h=200&fit=crop"
    },
    {
        username: "sunita_agri",
        email: "sunita@example.com",
        phone: "9876543211",
        country: "India",
        address: "Green Valley Road, Karnataka",
        full_name: "Sunita Reddy",
        password: "password123",
        role: "user",
        firm_name: "Reddy Seeds & Blooms",
        profile_pic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
    },
    {
        username: "kushal_kisan",
        email: "kushal@example.com",
        phone: "9876543212",
        country: "India",
        address: "Narmada Banks, Gujarat",
        full_name: "Kushal Patel",
        password: "password123",
        role: "user",
        firm_name: "Patel Irrigation Specialists",
        profile_pic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    }
];

const dummyPosts = [
    {
        question: "The monsoon arrived early this year. Soil looks promising for rice, but I am worried about water logging in the lower fields. Anyone else seeing this?",
        tags: ["harvesting", "farming", "weather"],
        photo: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800&q=80"
    },
    {
        question: "Just finished installing the new sensor system. Already seeing the moisture levels dropping faster than I thought. Technology is a lifesaver!",
        tags: ["tech", "planting", "sensors"],
        photo: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80"
    },
    {
        question: "My tractor's hydraulic pump is acting up. Does anyone know a reliable mechanic near Ludhiana who can fix it by weekend?",
        tags: ["help", "maintenance", "machinery"],
        photo: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80"
    },
    {
        question: "Organic tomatoes are ready for harvest! The yield is smaller but the quality is top-notch. Hoping for good rates at the mandi tomorrow.",
        tags: ["organic", "tomato", "market"],
        photo: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"
    },
    {
        question: "Morning walk around the wheat fields. The cold wave seems to have helped the crop. A quiet life is a good life.",
        tags: ["farming", "morning", "wheat"],
        photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
    },
    {
        question: "Started the solar pump installation today. Goodbye expensive diesel costs! Best investment I've made for the farm yet.",
        tags: ["solar", "investment", "irrigation"],
        photo: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Create users
        const createdUsers = [];
        for (const u of dummyUsers) {
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                const newUser = await User.create(u);
                createdUsers.push(newUser);
                console.log(`Created user: ${newUser.full_name}`);
            } else {
                createdUsers.push(existing);
                console.log(`User already exists: ${existing.full_name}`);
            }
        }

        // Create posts
        for (let i = 0; i < dummyPosts.length; i++) {
            const post = dummyPosts[i];
            const author = createdUsers[i % createdUsers.length];

            await Question.create({
                author_id: author._id,
                question: post.question,
                tags: post.tags,
                photo: post.photo,
                upvotes: [],
                downvotes: []
            });
            console.log(`Created post by ${author.full_name}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seed();
