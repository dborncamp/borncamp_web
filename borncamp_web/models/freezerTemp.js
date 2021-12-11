import {Decimal128, Date} from "mongoose";

const mongoose = require('mongoose');

const freezerSchema = new mongoose.Schema({
    freezer: String,
    dateTime: Date,
    insideTemp: Decimal128,
    outsideTemp: Decimal128
});

export var Freezer = mongoose.model("Freezer", freezerSchema);
