const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const { default: mongoose } = require("mongoose");

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  // get user tcikets
  const tickets = (await User.findById(req.user.id).populate("tickets"))
    .tickets;

  return res.status(200).json(tickets);
});

// @desc    create tickets for current user
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("product and description fields are mandatory");
  }

  try {
    const ticket = await Ticket.create({
      product,
      description,
      user: user._id,
    });

    user.tickets.push(ticket.id);
    await user.save();
    return res.status(201).json(ticket);
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

// @desc get ticket by id
// @route GET /api/tickets/:id
// @access private
const getTicket = asyncHandler(async (req, res, next) => {
  //   check id parameter exists
  if (!req.params?.id) {
    res.status(400);
    throw new Error("No ticket id sent");
  }
  // check user still in database
  const user = await User.findById(req.user.id);
  const ticket = await Ticket.findById(req.params.id);
  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  //   check user is authorized to get ticket
  if (ticket.user.toString() !== user.id) {
    res.status(401);
    throw new Error("Forbidden");
  }

  //   check tickets still exists
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not Found");
  }

  return res.status(200).json(ticket);
});

// @desc update ticket by id
// @route PUT /api/tickets/:id
// @access private
const updateTicket = asyncHandler(async (req, res, next) => {
  //   check id parameter exists
  if (!req.params?.id) {
    res.status(400);
    throw new Error("No ticket id sent");
  }

  // check user still in database
  const user = await User.findById(req.user.id);
  const ticket = await Ticket.findById(req.params.id);
  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  //   check user is authorized to update ticket
  if (ticket.user.toString() !== user.id) {
    res.status(401);
    throw new Error("Forbidden");
  }

  //   check ticket still exists
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not Found");
  }

  const { product, description, status } = req.body;

  try {
    ticket.product = product ? product : ticket.product;
    ticket.description = description ? description : ticket.description;
    ticket.status = status ? status : ticket.status;
    await ticket.save();
    return res.status(200).json(ticket);
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

// @desc delete ticket by id
// @route DELETE /api/tickets/:id
// @access private
const deleteTicket = asyncHandler(async (req, res, next) => {
  //   check id parameter exists
  if (!req.params?.id) {
    res.status(400);
    throw new Error("No ticket id sent");
  }
  // check user still in database
  const user = await User.findById(req.user.id);
  const ticket = await Ticket.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }

  //   check user is authorized to update ticket
  if (ticket.user.toString() !== user.id) {
    res.status(401);
    throw new Error("Forbidden");
  }

  //   check ticket still exists
  if (!ticket) {
    return res.status(200);
  }

  try {
    await ticket.remove();
    return res.status(200).json({ id: ticket.id });
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
};
