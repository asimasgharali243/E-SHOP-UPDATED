import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import Rating from "react-rating";
import { useAddReviewMutation } from "../../redux/api/productsApi/ProductApi";

const ReviewForm = ({ productId, refetchProduct }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [addReview, { isLoading, isError, isSuccess, error }] =
    useAddReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return;

    try {
      await addReview({ productId, rating, comment }).unwrap();
      setRating(0);
      setComment("");
      refetchProduct(); // refresh reviews
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <div className="review-form border rounded shadow-sm p-3 mt-3 bg-white">
      <h5 className="mb-3">Write a Comment</h5>

      {isSuccess && (
        <Alert variant="success" className="mb-3">
          Review submitted successfully!
        </Alert>
      )}

      {isError && (
        <Alert variant="danger" className="mb-3">
          {error?.data?.message || "Failed to submit review. Please try again."}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Comment Box */}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-100 pt-3"
            style={{ backgroundColor: `var(--background)` }}
            required
          />
        </Form.Group>

        {/* Rating Below Comment */}
        <Form.Group className="mb-3">
          <Form.Label>Your Rating</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Rating
              initialRating={rating}
              onChange={setRating}
              emptySymbol={<i className="bi bi-star text-warning fs-4" />}
              fullSymbol={<i className="bi bi-star-fill text-warning fs-4" />}
            />
            <span className="text-muted small">
              {rating > 0 ? `${rating} / 5` : "No rating yet"}
            </span>
          </div>
        </Form.Group>

        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReviewForm;
