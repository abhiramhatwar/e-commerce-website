import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import StyledHeading from "../components/StyledHeading";
import CartItem from "../components/Cartitem.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import emptyCart from "../assets/emptyCart.jpg";

function Cart() {
  const cartInfo = useSelector((state) => state.cart);
  const totalPrice = cartInfo.products.reduce((sum, prod) => sum + prod.product.price * prod.quantity, 0);
  const shipping = cartInfo.products.reduce((sum, prod) => sum + prod.quantity * 20, 100);

  return (
    <Container>
      <StyledHeading heading='Shopping Cart' />
      {cartInfo.products.length ? (
        <Row className='row-gap-3'>
          {/* Products */}
          <Col md={8}>
            <Card>
              {cartInfo.products.map((product) => (
                <CartItem product={product.product} quantity={product.quantity} key={product._id} />
              ))}
            </Card>
          </Col>

          {/* Checkout */}
          <Col md={4}>
            <Card className='p-4'>
              <div className='border-bottom mb-3'>
                <Row className='mb-3'>
                  <Col xs={6} className='text-start'>
                    <h5>Total Price:</h5>
                  </Col>
                  <Col xs={6} className='text-start'>
                    <h5>₹{totalPrice}.00</h5>
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
                  <h4 className='fw-bold'> ₹{totalPrice + shipping}.00</h4>
                </Col>
              </Row>
              <Link to='/checkout'>
                <Button variant='success' className='mt-3'>
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Row className='justify-content-center align-items-center'>
            <Col md={6}>
              <Image src={emptyCart} fluid alt='Empty Cart' />
            </Col>
            <Col md={6} className='d-flex flex-column justify-content-center align-items-center'>
              <h2>Your Cart is Empty!</h2>
              <p>Looks like you nothing added anything to your cart yet.</p>
              <Link to='/products'>
                <Button variant='success' size='lg'>
                  Start Shopping
                </Button>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Cart;
