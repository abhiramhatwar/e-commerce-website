import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { removeProduct, updateQuantity } from "../redux/slices/cartSlice";
import StyledToast from "./StyledToast";
import { useState } from "react";

function CartItem({ product, quantity, review = false }) {
  const dispatch = useDispatch();

  const [toast, setToast] = useState(false);

  // Update quantity of product
  const handleQuantity = (e) => {
    const quantity = e.target.value;
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/cart/${product._id}`,
        { quantity },
        {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setToast(res.data);
        dispatch(updateQuantity({ product, quantity }));
      })
      .catch((err) => {
        setToast(err.response.data);
      });
  };

  // Remove product from cart
  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/cart/${product._id}`, {
        headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setToast(res.data);
        dispatch(removeProduct({ product }));
      })
      .catch((err) => {
        setToast(err.response.data);
        console.error(err);
      });
  };

  return (
    <>
      <Card className='border-0'>
        <Card.Body className='border-bottom'>
          {/* Product */}
          <Row className='mb-3 row-gap-3'>
            <Col md={12} lg={4}>
              <Card.Img src={product.imageUrl} alt={product.name} height={150} className='object-fit-contain' />
            </Col>
            <Col md={12} lg={7} className='d-lg-flex justify-content-between align-items-start'>
              {/* Details */}
              <div>
                <h5>{product.name}</h5>
              </div>

              {/* Price and quantity */}
              {!review ? (
                <div className='d-flex flex-column flex-lg-row gap-3 align-items-start justify-content-start'>
                  <div className='d-flex flex-column'>
                    <span className='fw-bold fs-5'>₹{product.price * quantity}.00</span>
                    <span className='text-body-tertiary'>₹{product.price}.00 each</span>
                  </div>

                  <Form.Select
                    aria-label='Default select example'
                    value='#quantity'
                    className='shadow-none'
                    onChange={handleQuantity}
                  >
                    <option id='quantity'>QTY: {quantity}</option>
                    {/* Options will be either 9 or less than 9 according to stock */}
                    {Array.from(Array(Math.min(9, product.stock)).keys()).map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              ) : (
                <>
                  <span className=''>{quantity} piece </span>

                  <div className='d-flex flex-column'>
                    <span className='fw-bold fs-5'>₹{product.price * quantity}.00</span>
                    <span className='text-body-tertiary'>₹{product.price}.00 each</span>
                  </div>
                </>
              )}
            </Col>

            {/* Actions */}
            <Col md={12} lg={1} className='d-flex align-items-start justify-content-end'>
              <Button variant='danger' onClick={handleDelete} hidden={review}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <StyledToast toast={toast} onClose={() => setToast(false)} />
    </>
  );
}

export default CartItem;
