import mongoose from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    companyId: {
        type: String,
        required: false
    },
    employeeId: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    accessLevel: {
        type: ["ADMIN", "ONWER", "MANAGER", "OPERATOR"],
        required: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: false
    },
    pdvs: {
        type: Array,
        required: false
    }
});
schema.index({
    name: "text",
    email: "text"
});
export default mongoose.model("users", schema);
