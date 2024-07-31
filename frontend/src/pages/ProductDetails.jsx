import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import StyledLoading from "../components/StyledLoading";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Rating from "../components/Rating";
import noImage from "../assets/noImage.png";
import StyledToast from "../components/StyledToast";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/cartSlice";
import AddReview from "../components/AddReview";
import ReviewCard from "../components/ReviewCard";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    // get Product information
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Get reviews for product
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}/reviews`)
      .then((res) => {
        setReviews(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
    <div className='bg-white p-4 rounded shadow'>
      {loading ? (
        <div className='justify-content-center d-flex'>
          <StyledLoading anim='grow' size='sm' />
        </div>
      ) : (
        <Row className='p-3 gap-3 justify-content-between'>
          <Col
            className='border justify-content-center d-flex object-fit-cover position-relative'
            xs={12}
            lg={5}
            style={{ height: "400px" }}
          >
            {product.isFeatured && (
              <>
                <div
                  className='position-absolute start-0 bg-warning-subtle px-3 py-1 text-success-emphasis rounded-end'
                  style={{ top: "20px" }}
                >
                  Featured
                </div>
              </>
            )}
            {product.stock === 0 && (
              <>
                <div
                  className='position-absolute start-0 bg-danger-subtle  px-3 py-1 text-success-emphasis rounded-end'
                  style={{ top: "20px" }}
                >
                  Out of Stock!
                </div>
              </>
            )}
            <Image src={product.imageUrl ? product.imageUrl : noImage} rounded fluid />
          </Col>
          <Col xs={12} lg={4} className='d-flex flex-column gap-3'>
            <div className='border-bottom'>
              <h3>{product.name}</h3>
              <a href='#reviews'>
                <Rating productRating={product.averageRating} totalReviews={product.numberOfReviews} />
              </a>
              <h5>₹{product.price}</h5>
            </div>
            <div>{product.description}</div>
            <div className='d-flex gap-2'>
              {product.tags?.map((tag) => (
                <div className='rounded bg-info-subtle py-1 px-2' key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </Col>
          <Col xs={12} lg={2} className='border p-3 d-flex flex-column justify-content-between'>
            <div>
              <h5>₹{product.price}</h5>
              <a href='#reviews'>
                <Rating productRating={product.averageRating} totalReviews={product.numberOfReviews} />
              </a>
              {product.stock === 0 ? (
                <p className='text-danger'>Out of stock!</p>
              ) : (
                <p className='text-success'>In stock</p>
              )}
            </div>

            <Button
              className='bg-success-subtle hover-color-custom text-black border-0 w-100'
              disabled={product.stock === 0}
              onClick={addToCart}
            >
              <FontAwesomeIcon icon={faShoppingCart} className='me-2' />
              Add to cart
            </Button>
          </Col>

          {/* Ratings section */}

          <AddReview productId={id} />
          <h4 className='p-0' id='reviews'>
            Reviews
          </h4>
          {reviews.map((review) => (
            <ReviewCard review={review} key={review._id} />
          ))}

          <StyledToast toast={toast} onClose={() => setToast("")} />
        </Row>
      )}
    </div>
  );
}

export default ProductDetails;
