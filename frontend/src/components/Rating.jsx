import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function Rating({ productRating, totalReviews = 0 }) {
  return (
    <>
      {/* Render as many solid stars as the product rating */}
      {productRating >= 0 && (
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <FontAwesomeIcon
              className='text-warning'
              key={value}
              icon={value <= productRating ? solidStar : regularStar}
            />
          ))}
          {totalReviews > 0 && <p className='text-body-tertiary'> {totalReviews} reviews</p>}
        </div>
      )}
    </>
  );
}

export default Rating;
