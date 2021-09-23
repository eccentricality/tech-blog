const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

// get all posts
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
      userId: req.session.userId,
      userName: req.session.userName,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one post and comments
router.get("/posts/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const post = await postData.get({ plain: true });

    if (post.user_id === req.session.userId) {
      req.session.userPost = true;
    } else {
      req.session.userPost = false;
    }

    // find all comments for id
    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const comments = await commentData.map((comment) =>
      comment.get({ plain: true })
    );

    res.render("post", {
      ...post,
      loggedIn: req.session.loggedIn,
      userId: req.session.userId,
      userPost: req.session.userPost,
      userName: req.session.userName,
      comments,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user post and dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // find all user posts
    const postData = await Post.findAll({
      where: {
        user_id: req.session.userId,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      loggedIn: req.session.loggedIn,
      userId: req.session.userId,
      userName: req.session.userName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }

  res.render("adduser");
});

router.get("/addpost", (req, res) => {
  res.render("addpost", {
    loggedIn: req.session.loggedIn,
    userId: req.session.userId,
    userName: req.session.userName,
  });
});

// GET ROUTE FOR EDITING A POST BY ID
router.get("/editpost/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {});

    const post = postData.get({ plain: true });

    res.render("editpost", {
      ...post,
      loggedIn: req.session.loggedIn,
      userId: req.session.userId,
      userName: req.session.userName,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
