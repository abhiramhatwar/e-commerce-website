import { useDispatch, useSelector } from "react-redux";
import StyledHeading from "./StyledHeading";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import StyledLoading from "./StyledLoading";
import { Button, Card, Col, Container, Form, ProgressBar, Row, Tab } from "react-bootstrap";
import { useRef, useState } from "react";
import CartItem from "./Cartitem";
import axios from "axios";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const cartInfo = useSelector((state) => state.cart);
  const totalCost = cartInfo.products.reduce((sum, prod) => sum + prod.product.price * prod.quantity, 0);
  const shipping = cartInfo.products.reduce((sum, prod) => sum + prod.quantity * 20, 100);
  const reduxDispatch = useDispatch();

  const [steps, setsteps] = useState(0);
  const [currentTab, setCurrentTab] = useState("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    pincode: "",
    state: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo({ ...shippingInfo, [id]: value });
  };

  const handleShippingInfo = (e) => {
    e.preventDefault();
    if (isNaN(shippingInfo.pincode)) return;
    if (!shippingInfo.pincode || !shippingInfo.street || !shippingInfo.state || !shippingInfo.city) return;

    setCurrentTab("reviewOrder");
    setsteps(1);
  };

  const handleReviewOrder = () => {
    // Reset the paypal buttons with updated information
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: "USD",
      },
    });

    setCurrentTab("payment");
    setsteps(2);
  };

  // Paypal
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const orderID = useRef(null); // Using ref for order ID as state doesnt get updated from createOrder to onApprove

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: ((totalCost + shipping) / 83).toFixed(2),
            },
          },
        ],
      })
      .then((paypalID) => {
        const orderInfo = {
          products: cartInfo.products,
          shipping: {
            cost: shipping,
            address: { ...shippingInfo },
          },
          payment: data.paymentSource,
          paymentID: paypalID,
          totalCost: totalCost,
        };

        return axios
          .post(`${import.meta.env.VITE_API_URL}/orders`, orderInfo, {
            headers: { Authorization: localStorage.getItem("token") },
          })
          .then((res) => {
            orderID.current = res.data.message;
            return paypalID;
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onApprove = (data, actions) => {
    // Update order status

    return actions.order.capture().then(() => {
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/orders/user/${orderID.current}`,
          { status: "Confirmed" },
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        )
        .then(() => {
          // Clear cart
          axios
            .delete(`${import.meta.env.VITE_API_URL}/cart`, {
              headers: { Authorization: localStorage.getItem("token") },
            })
            .then(() => {
              setsteps(3);
              reduxDispatch(clearCart());
              setTimeout(() => {
                window.location.href = `/order/${orderID.current}`;
              }, 2000);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };
  const onCancel = (data) => {
    setTimeout(() => {
      window.location.href = `/order/${orderID.current}`;
    }, 2000);
    console.log("Cancelled", data);
  };

  return (
    <Container className='d-flex flex-column align-items-center'>
      <StyledHeading heading='Checkout' />

      {isPending ? (
        <div>
          <StyledLoading />
        </div>
      ) : (
        <Container className=''>
          <Row className='text-center h3'>
            <Col className={`p-2 ` + (steps >= 1 ? "text-success" : "text-body-tertiary")}>Shipping</Col>
            <Col className={`p-2 ` + (steps >= 2 ? "text-success" : "text-body-tertiary")}>Order</Col>
            <Col className={`p-2 ` + (steps >= 3 ? "text-success" : "text-body-tertiary")}>Payment</Col>
          </Row>
          <Row className='mb-4'>
            <Col>
              <ProgressBar now={steps * 34} variant='success' />
            </Col>
          </Row>

          <Tab.Container id='tab' defaultActiveKey={currentTab} activeKey={currentTab}>
            <Tab.Content className='bg-white p-4 rounded shadow'>
              <Tab.Pane eventKey='shipping'>
                <Container className='w-75'>
                  <h4>Shipping Address</h4>
                  <Form className='d-flex flex-column row-gap-3 ' onSubmit={handleShippingInfo}>
                    <Form.Group>
                      <Form.Label>Street</Form.Label>
                      <Form.Control
                        type='text'
                        id='street'
                        value={shippingInfo.street}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control type='text' id='city' value={shippingInfo.city} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type='text'
                        id='pincode'
                        value={shippingInfo.pincode}
                        onChange={handleChange}
                        required
                      />
                      {isNaN(shippingInfo.pincode) && (
                        <Form.Text className='text-danger'>Enter valid pincode</Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type='text'
                        id='state'
                        value={shippingInfo.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <div className='d-flex justify-content-center'>
                      <Button className='bg-success-subtle shadow-none text-black border-0 w-25' type='submit'>
                        Continue
                      </Button>
                    </div>
                  </Form>
                </Container>
              </Tab.Pane>

              <Tab.Pane eventKey='reviewOrder'>
                <Row className='row-gap-3'>
                  {/* Products */}
                  <Col md={8}>
                    <Card>
                      {cartInfo.products.map((product) => (
                        <CartItem
                          product={product.product}
                          quantity={product.quantity}
                          key={product._id}
                          review={true}
                        />
                      ))}
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card className='p-4'>
                      <div className='border-bottom mb-3'>
                        <Row className='mb-3'>
                          <Col xs={6} className='text-start'>
                            <h5>Total Price:</h5>
                          </Col>
                          <Col xs={6} className='text-start'>
                            <h5>₹{totalCost}.00</h5>
                          </Col>
                        </Row>

                        <Row className='mb-3'>
                          <Col xs={6} className='text-start'>
                            <h5>Shipping:</h5>
                          </Col>
                          <Col xs={6} className='text-start'>
                            <h5>₹{shipping}.00</h5>
                          </Col>
                        </Row>
                      </div>

                      <Row>
                        <Col xs={6}>
                          <h4>Total:</h4>
                        </Col>
                        <Col xs={6} className='text-start'>
                          <h4 className='fw-bold'> ₹{totalCost + shipping}.00</h4>
                        </Col>
                      </Row>
                      <Button variant='success' className='mt-3' onClick={handleReviewOrder}>
                        Continue to Payment
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey='payment'>
                <Container className='w-50'>
                  <PayPalButtons createOrder={createOrder} onApprove={onApprove} onCancel={onCancel} />
                </Container>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      )}
    </Container>
  );
}

export default Checkout;
