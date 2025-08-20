import React, { useMemo, useState } from "react";
import { Card, Alert, Image, Badge, Button } from "react-bootstrap";
import Rating from "react-rating";

const ReviewsList = ({ reviews = [] }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [imgError, setImgError] = useState(false);

  // Toggle comment expansion
  const toggleCommentExpansion = (reviewId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Helper functions
  const getInitials = (user) => {
    if (!user) return "A";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (
      (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    );
  };

  const getRandomColor = (seed) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA726",
      "#AB47BC",
      "#26A69A",
      "#7E57C2",
      "#42A5F5",
      "#66BB6A",
    ];
    const index = Math.abs(
      seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length
    );
    return colors[index];
  };

  // Memoized formatted reviews
  const formattedReviews = useMemo(() => {
    return reviews.map((review) => {
      const user = review.userId || {};
      const initials = getInitials(user);
      const name = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Anonymous";

      return {
        ...review,
        user: {
          ...user,
          initials,
          avatarColor: getRandomColor(name),
          displayName: name,
          formattedDate: new Date(review.reviewedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          formattedTime: new Date(review.reviewedAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
      };
    });
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4">
        <i
          className="bi bi-chat-square-text text-muted"
          style={{ fontSize: "3rem" }}
        ></i>
        <Alert variant="light" className="mt-3 d-inline-block">
          No reviews yet. Be the first to share your thoughts!
        </Alert>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      {formattedReviews.map((review) => {
        const isExpanded = expandedComments[review._id];
        const shouldTruncate = review.comment.length > 120;

        return (
          <Card key={review._id} className="mb-4 review-card">
            <Card.Body>
              {/* Top Row - Name and Date */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  {/* Avatar */}
                  <div className="me-2">
                    {review.user.profileImage && !imgError ? (
                      <Image
                        src={review.user.profileImage}
                        alt={review.user.displayName}
                        roundedCircle
                        width={40}
                        height={40}
                        className="border object-fit-cover"
                        onError={() => setImgError(true)}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="avatar-initials d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: review.user.avatarColor,
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        {review.user.initials}
                      </div>
                    )}
                  </div>

                  <div>
                    <h6 className="mb-0">{review.user.displayName}</h6>
                    {review.user.verified && (
                      <Badge pill bg="success" className="verified-badge mt-1">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-muted small">
                    {review.user.formattedDate}
                  </div>
                  <div className="text-muted small">
                    {review.user.formattedTime}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-2">
                <div
                  className={`review-comment ${
                    isExpanded ? "" : "comment-truncated"
                  }`}
                >
                  {review.comment}
                </div>
                {shouldTruncate && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-decoration-none read-more-btn"
                    onClick={() => toggleCommentExpansion(review._id)}
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </Button>
                )}
              </div>

              {/* Bottom Row - Rating and Images */}
              <div className="d-flex justify-content-between align-items-end">
                <Rating
                  initialRating={review.rating}
                  readonly
                  emptySymbol={<i className="bi bi-star text-warning" />}
                  fullSymbol={<i className="bi bi-star-fill text-warning" />}
                  fractions={2}
                />

                {review.images?.length > 0 && (
                  <div className="review-images">
                    {review.images.slice(0, 3).map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        thumbnail
                        className="ms-2"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ))}
                    {review.images.length > 3 && (
                      <div className="d-inline-block position-relative ms-2">
                        <span className="more-images-badge">
                          +{review.images.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default React.memo(ReviewsList);
