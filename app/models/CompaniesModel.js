import mongoose from "mongoose";
import { Schema } from "mongoose";

const contact = new Schema({
    name: {
        type: String
    },
    type: {
        type: ["EMAIL", "PHONE", "CELLPHONE", "WHATSAPP", "OTHERS"]
    },
    value: {
        type: String
    }
});
const schema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true,
        index: true,
        default: true
    },
    cnpj: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    address: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    complement: {
        type: String,
        required: false
    },
    neighborhood: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    contacts: [contact]
});
schema.index({
    cnpj: "text",
    name: "text"
});
export default mongoose.model("companies", schema);
