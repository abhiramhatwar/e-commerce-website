import { useState } from "react";
import { Button, Collapse, Form } from "react-bootstrap";
import axios from "axios";
import StyledToast from "./StyledToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AddReview({ productId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || comment === "") {
      setError("Please provide a rating and a comment.");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setToast(res.data);
        setRating(0);
        setComment("");
        setOpen(false);
      })
      .catch((err) => {
        setToast(err.response.data);
      });
  };

  return (
    <div className='w-75 p-0 d-flex flex-column gap-3'>
      <Button
        className='bg-success-subtle hover-color-custom text-black border-0 w-25'
        onClick={() => setOpen(!open)}
        aria-controls='addReview'
        aria-expanded={open}
      >
        <span className='me-2'>Add Review</span>
        <FontAwesomeIcon icon={faChevronDown} />
      </Button>
      <Collapse in={open} className='w-75'>
        <Form onSubmit={handleSubmit} id='addReview'>
          <Form.Group className='mb-3' controlId='formRating'>
            <Form.Label>Rating</Form.Label>
            <Form.Control as='select' value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className='mb-3' controlId='formComment'>
            <Form.Label>Comment</Form.Label>
            <Form.Control as='textarea' rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </Form.Group>
          {error && <p className='text-danger'>{error}</p>}
          <Button className='bg-success-subtle hover-color-custom text-black border-0 px-4' type='submit'>
            Submit Review
          </Button>
        </Form>
      </Collapse>
      <StyledToast toast={toast} onClose={() => setToast("")} />
    </div>
  );
}

export default AddReview;
