import { Card } from "react-bootstrap";
import Rating from "./Rating";

function ReviewCard({ review }) {
  return (
    <Card>
      <Card.Header className='d-flex flex-column bg-transparent px-0'>
        <Card.Title>
          {review.user.firstname} {review.user.lastname}
        </Card.Title>
        <Rating productRating={review.rating} />
        <span className='text-body-tertiary'>Reviewed on {review.createdAt.split("T")[0]}</span>
      </Card.Header>
      <Card.Body>{review.comment}</Card.Body>
    </Card>
  );
}

export default ReviewCard;
