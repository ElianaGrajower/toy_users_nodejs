const Toy = require("../models/Toy.model");
const asyncWrap = require("./../utils/asyncWrapper");
const AppError = require("../utils/AppError");
const { Types } = require("mongoose");


exports.deleteToy = asyncWrap(async (req, res, next) => {
    const toyId = req.params.delId;
    const userId = req.user.id;
    const toyToUpdate = await Toy.find({ id: toyId });
    // if (!toyToUpdate || toyToUpdate[0].user_id !== userId) throw new Error("Toy doesn't belong to user");
    if (!toyToUpdate) throw new Error("Toy doesn't belong to user");
    const deleted = await Toy.deleteOne({ id: toyId });
    res.status(200).json({
        status: "deleted",
        deleted,
    });
});

exports.editToy = asyncWrap(async (req, res, next) => {
    const body = req.body;
    const toyId = req.params.editId;
    const userId = req.user.id;
    const toyToUpdate = await Toy.find({ id: toyId, user_id: userId });
    console.log(userId);
    console.log(toyToUpdate);
    console.log(toyToUpdate[0].user_id);
    // if (!toyToUpdate || toyToUpdate[0].user_id != userId) throw new Error("Toy doesn't belong to user");
    if (!toyToUpdate) throw new Error("Toy doesn't belong to user");
    const updated = await Toy.updateOne({ id: toyId , user_id: userId}, body);
    res.status(200).json({
        status: "updated",
        updated,
    });
});

exports.addNewToy = asyncWrap(async (req, res, next) => {
    const body = req.body;
    const toy = { ...req.body };
    console.log(toy);
    // toy.user_id = req.user.id;
    toy.user_id = new Types.ObjectId(req.user.id);
    const newToy = await Toy.create(toy);
    console.log(newToy);
    res.status(201).json({
        status: "success",
        newToy,
    });
});

exports.getToys = asyncWrap(async (req, res, next) => {
    const query = req.query;
    console.log(query);

    const perPage = 10;
    let skip = 0;
    if (query.page) skip = (query.page - 1) * perPage;

    const toys = await Toy.find()
        .populate("user_id")
        .skip(skip)
        .limit(perPage);
    res.send(toys);
});

exports.getBySearch = asyncWrap(async (req, res, next) => {
    const query = req.query;
    const perPage = 10;
    let skip = 0;
    if (query.page) skip = (query.page - 1) * perPage;

    if (!query.s) throw new Error("Search for the name or info of a toy");
    const search = query.s;
    const toys = await Toy.find({ $or: [{ name: search }, { info: search }] })
        .populate("user_id")
        .skip(skip)
        .limit(perPage);
    if (!toys[0]) throw new Error("search not in the system");
    res.send(toys);
});

exports.getByCategory = asyncWrap(async (req, res, next) => {
    const { catname } = req.params;
    const query = req.query;
    const perPage = 10;
    let skip = 0;
    if (query.page) skip = (query.page - 1) * perPage;

    const toys = await Toy.find({ category: catname })
        .populate("user_id")
        .skip(skip)
        .limit(perPage);
    res.send(toys);
});

exports.getSingle = asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const toys = await Toy.find({ id }).populate("user_id");
    console.log(toys[0]);
    if (!toys[0]) throw new Error("toy id not in the system");
    res.send(toys[0]);
});


//?newTask.ownerId = userId;
//?if this doesnt work in addTask try newTask.ownerId = new Types.ObjectId(userId);
