const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const Note = require("../models/noteModel");

// @desc    Get ticket notes
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }
  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not Found");
  }

  if (ticket.user.toString() !== user._id.toString()) {
    res.status(401);
    throw new Error("Unothorized");
  }

  // get tickets notes
  const notes = await Note.find({ ticket: req.params.ticketId }).sort({
    createdAt: 1,
  });

  return res.status(200).json(notes);
});

// @desc    create ticket notes
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }
  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not Found");
  }

  if (ticket.user.toString() !== user._id.toString()) {
    res.status(401);
    throw new Error("Unothorized");
  }

  // get tickets notes
  const note = await Note.create({
    ticket: req.params.ticketId,
    text: req.body.text,
    isStaff: false,
    user: req.user.id,
  });

  return res.status(200).json(note);
});

module.exports = {
  getNotes,
  addNote,
};
