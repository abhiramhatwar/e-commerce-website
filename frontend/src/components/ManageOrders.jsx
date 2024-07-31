import { Button, Form, InputGroup, Table } from "react-bootstrap";
import StyledHeading from "./StyledHeading";
import StyledPagination from "./StyledPagination";
import axios from "axios";
import { useEffect, useState } from "react";
import StyledLoading from "./StyledLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPenToSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import OrderModal from "./OrderModal";
import { Link } from "react-router-dom";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const sort = -1;

  const [edit, setEdit] = useState(false);

  // Get all orders
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders?page=${page}&limit=${limit}&sort=${sort}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setOrders(res.data.message);
        setFilteredOrders(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  // Get total order count
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/count`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setTotalOrders(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSearch = (e) => {
    //If search is empty reset the orders
    if (!e.target.value) return setFilteredOrders(orders);

    //Can search with either client name or client email
    setFilteredOrders(
      orders.filter(
        (order) =>
          order.user.firstname.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.user.lastname.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.shipping.address.street.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.shipping.address.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.shipping.address.state.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.shipping.address.pincode.toLowerCase().includes(e.target.value.toLowerCase()) ||
          order.status.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <StyledHeading heading='Manage Orders' custom='bg-danger-subtle' />
      {loading ? (
        <div>
          <StyledLoading anim='grow' size='sm' />
        </div>
      ) : (
        <div className='bg-white p-4 rounded shadow d-flex flex-column gap-2 align-items-center'>
          <div className='d-flex justify-content-end align-items-center w-100'>
            {/* Search */}
            <InputGroup className='mb-3 w-25'>
              <Form.Control placeholder='Search...' className='shadow-none' onChange={handleSearch} />
              <Button variant='outline-secondary bg-transparent'>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </div>

          {/* All orders */}
          <Table striped bordered>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Client</th>
                <th>Address</th>
                <th>Total Cost (Payment Mode)</th>
                <th>Client E-mail</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1 + (page - 1) * limit}</td>
                  <td>
                    {order.user.firstname} {order.user.lastname}
                  </td>
                  <td>
                    {order.shipping.address.street}, {order.shipping.address.city}, {order.shipping.address.state} -{" "}
                    {order.shipping.address.pincode}
                  </td>
                  <td>
                    ₹{order.totalCost} ({order.payment})
                  </td>
                  <td>{order.user.email}</td>
                  <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                  <td>{order.status}</td>

                  <td className='d-flex gap-2 align-items-center justify-content-center '>
                    {/* Update order */}
                    {/* Cannot update cancelled orders */}
                    <Button
                      title='Edit order'
                      className={
                        (order.status === "Cancelled" ? "bg-danger-subtle" : "bg-success-subtle") +
                        " border-0 text-black "
                      }
                      onClick={() => setEdit(order)}
                      disabled={order.status === "Cancelled"}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>

                    {/* Order Details link */}
                    <Link to={`/order/${order._id}`} target='_blank' rel='noopener noreferrer'>
                      <Button title='Go to product page' className='bg-primary-subtle border-0 text-black'>
                        <FontAwesomeIcon icon={faLink} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <OrderModal order={edit} show={edit} onHide={() => setEdit(false)} title='Update order' />

          <StyledPagination page={page} setPage={setPage} lastPage={Math.ceil(totalOrders / limit)} />
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
