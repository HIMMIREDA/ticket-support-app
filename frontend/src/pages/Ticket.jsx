import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTicket, reset, closeTicket } from "../features/ticket/ticketSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Ticket() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { ticket, loading, isSuccess, isError, message } = useSelector(
    (state) => state.ticket
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getTicket());
    if (isError) {
      toast.error(message);
    }
    dispatch(getTicket(ticketId));
    dispatch(reset());
    return () => dispatch(reset());
  }, [message, isError, ticketId]);

//   close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  }
  if (loading) {
    return <Spinner />;
  }
  if (isError) {
    return <h3>Something Went Wrong</h3>;
  }


  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-us")}
        </h3>
        <h3>
            Product: {ticket.product}
        </h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue: </h3>
          <p>{ticket.description}</p>
        </div>
      </header>
      {ticket.status !== "closed" && (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>Close Ticket</button>
      )}
    </div>
  );
}

export default Ticket;
