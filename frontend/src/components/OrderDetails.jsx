import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StyledHeading from "./StyledHeading";
import StyledLoading from "./StyledLoading";
import { Col, Row } from "react-bootstrap";
import CartItem from "./Cartitem";

function OrderDetails() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data.message);
        setOrderDetails(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!orderDetails) return;

  return (
    <div>
      <StyledHeading heading='Order Details' />
      {loading ? (
        <div className='text-center'>
          <StyledLoading />
        </div>
      ) : (
        <div className='bg-white p-4 rounded shadow'>
          <Row>
            <Col md={6}>
              <h2>Order Details</h2>
              <p>
                <strong>Order ID:</strong> {orderDetails._id}
              </p>
              <p
                className={
                  orderDetails.status === "Processing" || orderDetails.status === "Cancelled" ? "text-danger" : ""
                }
              >
                <strong>Status:</strong> {orderDetails.status}
              </p>
              <p>
                <strong>Total Cost:</strong> ${orderDetails.totalCost}
              </p>
            </Col>
            <Col md={6}>
              <h3>Shipping Address</h3>
              <p>{orderDetails.shipping.address.street}</p>
              <p>
                {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state}{" "}
                {orderDetails.shipping.address.pincode}
              </p>
              <p>
                <strong>Shipping Cost:</strong> ${orderDetails.shipping.cost}
              </p>
            </Col>
          </Row>
          <Row className='row-gap-3'>
            <h3>Products</h3>
            <div className='border rounded'>
              {orderDetails.products.map((product) => (
                <Col md={12} key={product._id._id}>
                  <CartItem review={true} product={product._id} quantity={product.quantity} />
                </Col>
              ))}
            </div>
          </Row>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
