import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rating from "./Rating";
import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import noImage from "../assets/noImage.png";
import StyledToast from "./StyledToast";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/cartSlice";
function Product({ product }) {
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();

  const addToCart = () => {
    if (!localStorage.getItem("token")) return (window.location.href = "/login");

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { product: product._id },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch(addProduct({ product: product, quantity: 1 }));
        setToast(res.data);
      })
      .catch((err) => {
        setToast(err.response.data);
      });
  };

  return (
    <Col lg={3} md={6} xs={8} key={product._id}>
      <Card className='p-0 h-100'>
        <Link to={`/products/${product._id}`} style={{ height: "300px" }}>
          {product.isFeatured && (
            <>
              <div
                className='position-absolute bg-warning-subtle px-3 py-1 text-success-emphasis rounded-end'
                style={{ top: "20px" }}
              >
                Featured
              </div>
            </>
          )}
          {product.stock === 0 && (
            <>
              <div
                className='position-absolute bg-danger-subtle  px-3 py-1 text-success-emphasis rounded-end'
                style={{ top: "20px" }}
              >
                Out of Stock!
              </div>
            </>
          )}
          <Card.Img
            variant='top'
            src={product.imageUrl ? product.imageUrl : noImage}
            alt='Product Image'
            height={300}
            className='object-fit-contain'
          />
        </Link>

        <Card.Body className='d-flex flex-column justify-content-between'>
          <Link to={`/products/${product._id}`} className='text-decoration-none text-body d-flex flex-column gap-3 '>
            <div className='d-flex justify-content-between'>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text as='span' className='text-secondary'>
                ₹{product.price}
              </Card.Text>
            </div>
            <Rating productRating={product.averageRating} totalReviews={product.numberOfReviews} />
            <Card.Text>
              {product.description.length > 100 ? product.description.slice(1, 100) + "..." : product.description}
            </Card.Text>
          </Link>

          <Button
            className='bg-success-subtle hover-color-custom text-black border-0'
            disabled={product.stock === 0}
            onClick={addToCart}
          >
            <FontAwesomeIcon icon={faShoppingCart} className='me-2' />
            Add to cart
          </Button>
        </Card.Body>
      </Card>

      <StyledToast toast={toast} onClose={() => setToast(false)} />
    </Col>
  );
}

export default Product;
