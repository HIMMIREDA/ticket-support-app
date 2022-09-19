import { useParams } from "react-router-dom";

function Ticket() {
    const {ticketId} = useParams();
    console.log(ticketId);
  return <div>Ticket</div>;
}

export default Ticket;
