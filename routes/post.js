const { Post } = require("../models/post");
const { Router } = require("express");
const postRouter = Router();
postRouter.get("/", async (req, res) => {
    try {
        const { userId } = req.body;
        const { device = ["Tablet", "Laptop", "Mobile"] } = req.query;
        const posts = await Post.find({ $and: [{ userId }, { device: { $in: device } }] }); res.json({ posts, msg: "Your posts" });
    } catch (error) {
        res.send(error.message);
    }
});
postRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id); res.send({ post });
    } catch (error) {
        res.send({ msg: error.message });
    }
});

postRouter.post("/", async (req, res) => {
    try {
        const data = req.body;
        const newpost = new Post(data);
        await newpost.save();
        res.send({ msg: "Post created", post: newpost });
    } catch (error) {
        res.send(error.message);
    }
});
postRouter.patch("/update/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const updated = await Post.findByIdAndUpdate(id, data); res.send({ msg: "Post updated", post: updated });
    } catch (error) {
        res.send({ msg: error.message });
    }
});

postRouter.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Post.findByIdAndDelete(id); if (deleted) {
            res.send({ msg: "Post deleted", post: deleted });
        } else { res.send({ msg: "Post not found" }); }
    } catch (error) {
        console.log(error);
        res.send({ msg: error.message });
    }

});
module.exports = { postRouter };