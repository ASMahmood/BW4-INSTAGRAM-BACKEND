const express = require("express");
const Post = require("../../database").Post;
const Comment = require("../../database").Comment;
const SavedPost = require("../../database").SavedPost;
const StoryAlbum = require("../../database").StoryAlbum;
const User = require("../../database").User;

const router = express.Router();

router.post("/:albumName/:storyId", async (req, res) => {
  try {
    const storyInAlbum = await StoryAlbum.findOne({
      where: {
        albumName: req.params.albumName,
        userId: req.user.dataValues.id,
        storyId: req.params.storyId,
      },
    });
    if (storyInAlbum) {
      await StoryAlbum.destroy({
        where: {
          albumName: req.params.albumName,
          userId: req.user.dataValues.id,
          storyId: req.params.storyId,
        },
      });
      res.status(201).send("Story removed from Album!");
    } else {
      await StoryAlbum.create({
        albumName: req.params.albumName,
        userId: req.user.dataValues.id,
        storyId: req.params.storyId,
      });
      res.status(201).send("Story added to Album!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/:userId/", async (req, res) => {
  try {
    const albums = await StoryAlbum.findAll({
      where: { userId: req.user.dataValues.id },
    });
    const groupedAlbums = {};
    await albums.forEach((album) => {
      if (groupedAlbums[album.albumName]) {
        groupedAlbums[album.albumName].push(album);
      } else {
        groupedAlbums[album.albumName] = [album];
      }
    });
    res.send(groupedAlbums);
    res.send(albums);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
