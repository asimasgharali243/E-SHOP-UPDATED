import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Card, Badge, Alert } from "react-bootstrap";
import {
  useStartNegotiationMutation,
  usePostMessageMutation,
  useToggleAIMutation,
  useUpdateStatusMutation,
  useGetNegotiationsByProductQuery,
} from "../../redux/api/productsApi/ProductApi";

export default function NegotiationChat({ product, userId }) {
  const [text, setText] = useState("");
  const [negotiation, setNegotiation] = useState(null);
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);
  console.log("NegotiationChat mounted with product:", product);
  const [startNegotiation, { isLoading: isStarting }] =
    useStartNegotiationMutation();
  const [postMessage, { isLoading: isPosting }] = usePostMessageMutation();
  const [toggleAI] = useToggleAIMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const { data: negotiationsByProduct } = useGetNegotiationsByProductQuery(
    product._id,
    { skip: !product?._id }
  );

  useEffect(() => {
    if (negotiationsByProduct && negotiationsByProduct.length) {
      const active =
        negotiationsByProduct.find((n) => n.status === "active") ||
        negotiationsByProduct[0];
      if (active) {
        setNegotiation(active);
        setMessages(active.messages || []);
      }
    }
  }, [negotiationsByProduct]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = async () => {
    if (!text.trim()) return;
    try {
      const res = await startNegotiation({
        productId: product._id,
        initialMessage: text,
      }).unwrap();

      console.log("Start negotiation response:", res);
      console.log("Response _id:", res._id);
      console.log("Response negotiationId:", res.negotiationId);
      setNegotiation(res);
      setMessages(res.messages || []);
      setText("");
    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to start negotiation");
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !negotiation) return;

    console.log("negotiation object:", negotiation);
    console.log("negotiation._id:", negotiation._id);
    console.log("negotiation ID type:", typeof negotiation._id);
    try {
      const res = await postMessage({
        negotiationId: negotiation.negotiationId,
        message: text,
      }).unwrap();
      setMessages(res.messages || []);
      setText("");
    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to send message");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      negotiation ? handleSend() : handleStart();
    }
  };

  const handleToggleAI = async () => {
    if (!negotiation) return;
    try {
      const res = await toggleAI({ negotiationId: negotiation._id }).unwrap();
      setNegotiation((prev) => ({ ...prev, useAI: res.useAI }));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle AI");
    }
  };

  const handleAccept = async () => {
    if (!negotiation) return;
    const priceStr = prompt("Enter accepted final price:");
    const price = Number(priceStr);
    if (Number.isNaN(price)) return alert("Invalid price");
    try {
      await updateStatus({
        negotiationId: negotiation._id,
        status: "accepted",
        finalPrice: price,
      }).unwrap();
      setNegotiation((prev) => ({
        ...prev,
        status: "accepted",
        negotiatedPrice: price,
      }));
      alert("Offer accepted.");
    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to accept");
    }
  };

  if (!product.negotiationEnabled) {
    return (
      <Alert variant="info">
        Price negotiation is not available for this product.
      </Alert>
    );
  }

  const disabled = negotiation?.status && negotiation.status !== "active";

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Price Negotiation</h5>
        {negotiation && (
          <Badge bg={negotiation.useAI ? "success" : "secondary"}>
            AI: {negotiation.useAI ? "ON" : "OFF"}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <div
          style={{ height: 320, overflowY: "auto" }}
          className="mb-3 p-2 bg-light rounded"
        >
          {messages.length === 0 ? (
            <div className="text-muted p-3">
              Start negotiation by sending a message
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${
                  m.from === "buyer"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    m.from === "buyer" ? "bg-primary text-white" : "bg-white"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <small className="d-block fw-bold text-uppercase mb-1">
                    {m.from === "buyer"
                      ? "You"
                      : m.from === "bot"
                      ? "AI Assistant"
                      : "Seller"}
                  </small>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <div className="d-flex gap-2">
          <Form.Control
            as="textarea"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              negotiation
                ? "Type your message..."
                : "Make an offer to start negotiation..."
            }
            disabled={disabled}
          />
          <Button
            onClick={negotiation ? handleSend : handleStart}
            disabled={
              (negotiation ? isPosting : isStarting) || !text.trim() || disabled
            }
          >
            {negotiation
              ? isPosting
                ? "Sending..."
                : "Send"
              : isStarting
              ? "Starting..."
              : "Start"}
          </Button>
        </div>

        {negotiation && userId === product.userId && (
          <div className="mt-3 d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleToggleAI}
            >
              Toggle AI ({negotiation.useAI ? "ON" : "OFF"})
            </Button>
            {negotiation.status === "active" && (
              <Button variant="success" size="sm" onClick={handleAccept}>
                Accept Offer
              </Button>
            )}
          </div>
        )}

        {negotiation?.status === "accepted" && (
          <Alert variant="success" className="mt-3">
            <strong>Offer Accepted!</strong> Final price: $
            {negotiation.negotiatedPrice}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
