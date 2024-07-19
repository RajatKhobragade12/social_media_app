const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { verifyToken, authorization } = require("../middleware/auth");

async function createComment(req, res) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).send({ message: "Missing fields" })

        }
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

        let auth;
        try {
            auth = await authorization(email);
        } catch (error) {
            return res.status(403).send({ message: error.message })
        }

        const post = await postModel.findOne({ _id: id });
        if (!post) {
            return res.status(404).send({ message: "Post not found" })

        }

        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        const comment = await commentModel.create({ content: content, postId: id, userId: user._id });
        return res.status(201).send({ message: "comment created successfully", data: comment })

    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message })

    }



};



async function commentList(req, res) {
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
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }
        const comments = await commentModel.find({ userId: user._id }).populate('postId').limit(10)
        return res.status(200).send({ message: "comments retrived successfully", data: comments })


    } catch (error) {

    }
}

module.exports = {
    createComment,
    commentList
}