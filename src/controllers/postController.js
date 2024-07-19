const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { verifyToken, authorization } = require("../middleware/auth");

async function createPost(req, res) {
    try {
        const token = req.headers["token"];
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send({ message: "Missing fields" })
        }
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
        let auth;
        try {
            auth = await authorization(email);
        } catch (error) {
            return res.status(403).send({ message: error.message })
        }
        const newPost = await postModel.create({ title: title, content: content });
        return res.status(201).send({ message: "Post created successfully", data: newPost })

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })
    }
}

async function postList(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }

        const posts = await postModel.find();
        return res.status(200).send({ message: "Posts retrive successfully", data: posts })

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }

}

async function postInfo(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        const { id } = req.params;
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
        const post = await postModel.findOne({ _id: id });
        if (!post) {
            return res.status(404).send({ message: "Post not found" })

        }
        return res.status(200).send({ message: "Post retrive successfully", data: post })

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }
}



async function deletePost(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        const { id } = req.params;
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
        const post = await postModel.findOneAndDelete({ _id: id });
        if (!post) {
            return res.status(404).send({ message: "Post not found" })

        }
        return res.status(200).send({ message: "Post deleted successfully" })


    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }
}

async function likePost(req, res) {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(400).send({ message: "Token missing in headers" })
        }
        const { id } = req.params;
        let email;
        try {
            email = await verifyToken(token)
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }

        let auth;
        try {
            auth = await authorization(email);
        } catch (error) {
            return res.status(403).send({ message: error.message })
        }
        
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        const post = await postModel.findOne({ _id: id });

        if (!post) {
            return res.status(404).send({ message: "Post not found" })

        }
        post.likes.push(user._id)
        post.save();
        return res.status(200).send({ message: "Post liked successfully" })

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }
}


module.exports = {
    createPost,
    postList,
    deletePost,
    likePost,
    postInfo
}