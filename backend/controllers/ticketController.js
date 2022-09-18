const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// @desc    Get user tickets
// @route   GET /api/tickets 
// @access  Private
const getTickets = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("Unothorized");
  }

  // get user tcikets
  const tickets = (await User.findById(req.user.id).populate("tickets"))
    .tickets;

  return res.status(200).json(
    tickets.map((ticket) => ({
      product: ticket.product,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }))
  );
});


// @desc    create tickets for current user
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("Unothorized");
  }

  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("product and description fields are mandatory");
  }

  try {
    const ticket = new Ticket({ product, description, user: user._id });
    await ticket.save();
    user.tickets.push(ticket.id);
    await user.save();
    return res.sendStatus(201);
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

module.exports = {
  getTickets,
  createTicket,
};
