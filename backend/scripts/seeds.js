//TODO: seeds script should come here, so we'll be able to put some data in our local env
require("dotenv").config();

var mongoose = require("mongoose");

require("../models/User");
require("../models/Item");
require("../models/Comment");

var User = mongoose.model("User");
var Item = mongoose.model("Item");
var Comment = mongoose.model("Comment");

mongoose.connect(process.env.MONGODB_URI);

var userIds = [];
var itemIds = [];

async function seedUsers() {
    for (var i = 0; i < 100; i++) {
        var user = new User();
        user.username = "user" + i;
        user.email = "user" + i + "@test.ts";
        user.setPassword("user" + i);

        userIds.push(user._id);

        await user.save();
    }
}

async function seedItems() {
    for (var i = 0; i < 100; i++) {
        var user = await User.findOne({ _id: userIds[i] });
        var item = new Item();
        item.title = "item" + i;
        item.description = "description" + i;
        item.image = "https://picsum.photos/200/300";
        item.seller = user;
        
        itemIds.push(item._id);

        await item.save();
    }
}

async function seedComments() {
    for (var i = 0; i < 100; i++) {
        var user = await User.findOne({ _id: userIds[i] });
        var item = await Item.findOne({ _id: itemIds[i] });
        var comment = new Comment();
        comment.body = "comment" + i;
        comment.seller = user;
        comment.item = item;

        await comment.save();
    }
}


async function seed() {
    // delete all
    await User.remove({});
    await Item.remove({});
    await Comment.remove({});

    await seedUsers();
    await seedItems();
    await seedComments();

    mongoose.disconnect();
}

seed();

