const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find(req.query);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the posts.',
    });
  }
});

router.get('/:id', async (req, res) => {
  console.log(`hit /:id with ${req.id}`);
  try {
    const post = await Posts.findById(req.params.id);

    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the post.',
    });
  }
});

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;

    Posts.findPostComments(id)
    .then(comments => {
        if (comments && comments.length) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message: "Cannot find comments."});
        }})
    .catch(error => {
        res.status(500).json(error);
    });
});

function postAccepted(post) {
	const { title, contents } = post;
	return title && contents;
}

router.post("/", async (req, res) => {
	if (!postAccepted(req.body)) {
		res.status(400).json({
			error: "Please provide title and contents for this post."
		});
	} else {
		try {
			const post = await Posts.insert(req.body);
			const newPost = await Posts.findById(post.id);
			res.status(201).json(newPost);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "There was an error while saving the post to the database."
			});
		}
	}
});

function commentAccepted(comment) {
	const { text } = comment;
	return !!text;
}

router.post("/:id/comments", async (req, res) => {
	if (!commentAccepted(req.body)) {
		res.status(400).json({
			error: "Please provide text for the comment."
		});
	} else {
		try {
			const post = await Posts.findById(req.params.id);
			const comment = await Posts.insertComment({
				...req.body,
				post_id: req.params.id
			});
			const newComment = await Posts.findCommentById(comment.id);
			if (post) {
				res.status(201).json(newComment);
			} else {
				res
					.status(404)
					.json({ message: "The post with the specified ID does not exist." });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "There was an error while saving the comment to the database."
			});
		}
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const post = await Posts.findById(req.params.id);
		const count = await Posts.remove(req.params.id);
		if (count > 0) {
			res.status(200).json(post);
		} else {
			res
				.status(404)
				.json({ message: "The post with the specified ID does not exist." });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The post could not be removed."
		});
	}
});

module.exports = router