const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    product: {
        type: String,
        required: [true, "Please select a product"],
        enum: {
            values: ["iPhone", "Macbook Pro","iMac", "iPad"],
            message: "product can have 4 values : iPhone | Macbook Pro | iMac | iPad"
        }
    },
    description: {
        type: String,
        required: [true, "Please enter a description of the issue"]
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["new", "open", "closed"],
            message: "ticket status can have these 3 values : new | open | closed"
        },
        default: "new"
    }


},{
    timestamps: true
});

module.exports = mongoose.model("Ticket", ticketSchema);
