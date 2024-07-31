import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StyledLoading from "./StyledLoading";
import { Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function OrderModal({ show, onHide, title = " ", order = false }) {
  const [orderInfo, setOrderInfo] = useState({
    deliveryDate: "",
    status: "Processing",
  });
  const [load, setLoad] = useState(false);
  const [result, setResult] = useState("");

  const clearInfo = () => {
    setOrderInfo({
      deliveryDate: "",
      status: "Processing",
    });
  };

  useEffect(() => {
    clearInfo();
    if (order) {
      setOrderInfo({
        deliveryDate: new Date(order.deliveryDate).toISOString().split("T")[0],
        status: order.status,
      });
    }
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    // Update Order
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/orders/${order._id}`,
        { ...orderInfo },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        setResult(res.data.message);
      })
      .catch((err) => {
        setResult(err.response.data.error);
        console.error(err);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setOrderInfo({ ...orderInfo, [id]: value });
  };
  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop='static'>
        {title && (
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        )}
        <Form onSubmit={handleSubmit}>
          <Modal.Body className='d-flex flex-column gap-3'>
            <InputGroup>
              <InputGroup.Text className='w-25'>Delivery Date</InputGroup.Text>
              <Form.Control
                id='deliveryDate'
                type='date'
                min={new Date().toISOString().split("T")[0]}
                className='shadow-none'
                onChange={handleChange}
                required
                value={orderInfo.deliveryDate}
              />
            </InputGroup>{" "}
            <InputGroup>
              <InputGroup.Text className='w-25'>Status</InputGroup.Text>
              <Form.Select
                id='status'
                type='select'
                min='0'
                className='shadow-none'
                onChange={handleChange}
                required
                value={orderInfo.status}
              >
                <option value='Processing'>Processing</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Shipped'>Shipped</option>
                <option value='Delivered'>Delivered</option>
                <option value='Cancelled'>Cancelled</option>
              </Form.Select>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-start '>
            <Button className='bg-success-subtle hover-color-custom text-black border-0' type='submit'>
              {order ? "Update Order" : "Add Order"}
            </Button>
          </Modal.Footer>
        </Form>

        {load && (
          <Modal.Title className='d-flex justify-content-center py-3 gap-1'>
            <StyledLoading anim='grow' size='sm' />
          </Modal.Title>
        )}
        {result && <p className='text-center'>{result}</p>}
      </Modal>
    </>
  );
}

export default OrderModal;
