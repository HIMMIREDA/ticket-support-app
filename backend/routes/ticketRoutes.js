const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


// Re-route into note router
const noteRoute = require("./noteRoutes");

router.use("/:ticketId/notes", noteRoute);

const {
  getTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

router.route("/").get(protect, getTickets).post(protect, createTicket);

router
  .route("/:id")
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

module.exports = router;
