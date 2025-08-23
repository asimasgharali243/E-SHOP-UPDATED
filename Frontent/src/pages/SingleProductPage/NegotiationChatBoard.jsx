import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Card, Form, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { io } from "socket.io-client";
import {
  useStartNegotiationMutation,
  usePostMessageMutation,
  useToggleAIMutation,
  useUpdateStatusMutation,
  useGetNegotiationsByProductQuery,
} from "../../redux/api/productsApi/ProductApi";

// Constants
const SOCKET_SERVER_URL = "http://localhost:5000";
const SOCKET_CONNECTION_STATES = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  ERROR: "error",
};

const MESSAGE_STATUS = {
  SENDING: "sending",
  FAILED: "failed",
  SENT: "sent",
};

// MessageBubble Component
const MessageBubble = memo(({ message, onRetry, isCurrentUser }) => {
  const isBot = message.from === "bot";
  const from = isCurrentUser ? "You" : isBot ? "AI Assistant" : "Seller";

  const messageBg = isCurrentUser
    ? "bg-primary text-white"
    : isBot
    ? "bg-light border"
    : "bg-white border";

  const alignClass = isCurrentUser
    ? "justify-content-end"
    : "justify-content-start";

  const timestamp = useMemo(() => {
    return message.timestamp
      ? new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  }, [message.timestamp]);

  return (
    <div className={`d-flex mb-2 ${alignClass}`}>
      <div
        className={`p-2 rounded ${messageBg} ${
          message.status === MESSAGE_STATUS.FAILED ? "border-danger" : ""
        }`}
        style={{ maxWidth: "75%" }}
      >
        <small className="d-block fw-bold text-uppercase mb-1">{from}</small>
        <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <small className="opacity-75">{timestamp}</small>
          {isCurrentUser && message.status === MESSAGE_STATUS.SENDING && (
            <Spinner
              animation="border"
              variant="secondary"
              size="sm"
              className="ms-2"
            />
          )}
          {isCurrentUser && message.status === MESSAGE_STATUS.FAILED && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-danger ms-2"
              onClick={() => onRetry(message.text)}
              title="Retry sending"
              aria-label="Retry sending message"
            >
              <small>
                <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                Retry
              </small>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

// Main NegotiationChat Component
const NegotiationChat = ({ product, userId }) => {
  if (!product || !product?._id) {
    return <Alert variant="warning">Product info missing.</Alert>;
  }

  if (!product.negotiationEnabled) {
    return (
      <Alert variant="info">Negotiation not available for this product.</Alert>
    );
  }

  const [text, setText] = useState("");
  const [negotiation, setNegotiation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socketStatus, setSocketStatus] = useState(
    SOCKET_CONNECTION_STATES.DISCONNECTED
  );
  const [fallbackMode, setFallbackMode] = useState(false);

  // refs
  const endRef = useRef(null);
  const socketRef = useRef(null);
  const isMountedRef = useRef(true);
  const inputRef = useRef(null);

  // API hooks
  const [startNegotiation] = useStartNegotiationMutation();
  const [postMessage] = usePostMessageMutation();
  const [toggleAI] = useToggleAIMutation();
  const [updateStatus] = useUpdateStatusMutation();

  const {
    data: negotiationsData,
    isLoading,
    error: negotiationsError,
  } = useGetNegotiationsByProductQuery(product._id, { skip: !product._id });

  const activeNegotiation = useMemo(() => {
    if (!negotiationsData?.length) return null;
    return (
      negotiationsData.find((n) => n.status === "active") || negotiationsData[0]
    );
  }, [negotiationsData]);

  useEffect(() => {
    if (activeNegotiation) {
      setNegotiation(activeNegotiation);
      setMessages(activeNegotiation.messages || []);
    }
  }, [activeNegotiation]);

  // Socket connection
  useEffect(() => {
    if (!negotiation?._id) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSocketStatus(SOCKET_CONNECTION_STATES.CONNECTING);

    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      if (!isMountedRef.current) return;
      setSocketStatus(SOCKET_CONNECTION_STATES.CONNECTED);
      socket.emit("joinNegotiation", negotiation._id);
      setFallbackMode(false);
    };

    const handleDisconnect = () => {
      if (!isMountedRef.current) return;
      setSocketStatus(SOCKET_CONNECTION_STATES.DISCONNECTED);
    };

    const handleConnectError = (error) => {
      if (!isMountedRef.current) return;
      setSocketStatus(SOCKET_CONNECTION_STATES.ERROR);
      // Enable fallback mode after connection error
      setFallbackMode(true);
    };

    const handleNegotiationUpdate = (updated) => {
      if (isMountedRef.current && updated._id === negotiation._id) {
        setNegotiation(updated);
        setMessages(updated.messages || []);
        setIsSubmitting(false);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("negotiationUpdate", handleNegotiationUpdate);

    return () => {
      if (socketRef.current) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        socket.off("negotiationUpdate", handleNegotiationUpdate);
        socket.emit("leaveNegotiation", negotiation._id);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [negotiation?._id]);

  // Reset isMounted on mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // manual reconnect
  const handleReconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
    setFallbackMode(false);
    setSocketStatus(SOCKET_CONNECTION_STATES.CONNECTING);
  }, []);

  // auto-scroll
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSendMessage = useCallback(
    async (messageText, isRetry = false) => {
      if (!messageText.trim() || isSubmitting) return;

      setIsSubmitting(true);
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        _id: tempId,
        from: "buyer",
        text: messageText,
        status: MESSAGE_STATUS.SENDING,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        if (isRetry) {
          return prev.map((m) =>
            m.text === messageText && m.status === MESSAGE_STATUS.FAILED
              ? tempMessage
              : m
          );
        }
        return [...prev, tempMessage];
      });

      setText("");

      try {
        let result;
        if (!negotiation) {
          result = await startNegotiation({
            productId: product._id,
            initialMessage: messageText,
          }).unwrap();
        } else {
          result = await postMessage({
            negotiationId: negotiation._id,
            message: messageText,
          }).unwrap();
        }
        if (isMountedRef.current) {
          setNegotiation(result);
          setMessages(result.messages || []);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempId ? { ...m, status: MESSAGE_STATUS.FAILED } : m
            )
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [isSubmitting, negotiation, product._id, startNegotiation, postMessage]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(text);
      }
    },
    [text, handleSendMessage]
  );

  const handleAcceptOffer = useCallback(async () => {
    if (!negotiation) return;
    const price = prompt("Enter final price:");
    if (price === null) return;
    const finalPrice = parseFloat(price);
    if (isNaN(finalPrice) || finalPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    try {
      const result = await updateStatus({
        negotiationId: negotiation._id,
        status: "accepted",
        finalPrice,
      }).unwrap();
      if (isMountedRef.current) {
        setNegotiation(result);
        setMessages(result.messages || []);
      }
    } catch (err) {
      alert(`Error: ${err.data?.message || err.message}`);
    }
  }, [negotiation, updateStatus]);

  const isSeller = useMemo(
    () => negotiation?.sellerId === userId,
    [negotiation, userId]
  );
  const isChatActive = useMemo(
    () => !negotiation || negotiation?.status === "active",
    [negotiation]
  );

  // Simplified input disabled logic - allow sending even if socket is disconnected
  const isInputDisabled = useMemo(
    () => isSubmitting || (negotiation && !isChatActive),
    [isSubmitting, isChatActive, negotiation]
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (negotiationsError) {
    return (
      <Alert variant="danger" className="mt-4">
        Failed to load negotiations: {negotiationsError.message}
      </Alert>
    );
  }

  const socketStatusVariant =
    socketStatus === SOCKET_CONNECTION_STATES.CONNECTED
      ? "success"
      : socketStatus === SOCKET_CONNECTION_STATES.CONNECTING
      ? "warning"
      : "danger";

  const socketStatusText =
    socketStatus === SOCKET_CONNECTION_STATES.CONNECTING
      ? "CONNECTING"
      : socketStatus === SOCKET_CONNECTION_STATES.CONNECTED
      ? "CONNECTED"
      : fallbackMode
      ? "FALLBACK MODE"
      : "DISCONNECTED";

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 me-2">Price Negotiation</h5>
          <Badge bg={socketStatusVariant} className="me-2">
            {socketStatusText}
          </Badge>
          {socketStatus !== SOCKET_CONNECTION_STATES.CONNECTED && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleReconnect}
              disabled={socketStatus === SOCKET_CONNECTION_STATES.CONNECTING}
            >
              Reconnect
            </Button>
          )}
          {isSubmitting && (
            <Spinner
              animation="border"
              size="sm"
              className="ms-2"
              variant="primary"
            />
          )}
        </div>

        {isSeller && isChatActive && (
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => toggleAI({ negotiationId: negotiation._id })}
              disabled={isSubmitting}
            >
              {negotiation.useAI ? "Disable AI" : "Enable AI"}
            </Button>
            <Button
              size="sm"
              variant="success"
              onClick={handleAcceptOffer}
              disabled={isSubmitting}
            >
              Accept Offer
            </Button>
          </div>
        )}
      </Card.Header>

      {fallbackMode && (
        <Alert variant="warning" className="mb-0">
          <small>
            Using fallback mode. Messages may be delayed.
            <Button variant="link" size="sm" onClick={handleReconnect}>
              Try to reconnect
            </Button>
          </small>
        </Alert>
      )}

      <Card.Body style={{ maxHeight: 400, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted py-4">
            Start negotiating by sending a message below
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              onRetry={handleSendMessage}
              isCurrentUser={msg.from === "buyer"}
            />
          ))
        )}
        <div ref={endRef} aria-hidden="true" />
      </Card.Body>

      <Card.Footer>
        <Form.Control
          ref={inputRef}
          as="textarea"
          placeholder={isSubmitting ? "Processing..." : "Type your message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isInputDisabled}
          rows={2}
        />
        <Button
          variant="primary"
          className="mt-2 w-100"
          onClick={() => handleSendMessage(text)}
          disabled={isInputDisabled || !text.trim()}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="me-2" /> Processing...
            </>
          ) : negotiation ? (
            "Send Message"
          ) : (
            "Start Negotiation"
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default memo(NegotiationChat);
