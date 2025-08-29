import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import ImageUpload from "../../../components/Dashboard/productAddPage/ImageUpdate";
import {
  useGetSignatureQuery,
  useUploadImageMutation,
  useUpdateProductMutation,
  useRollbackProductMutation,
  useGetSingleProductQuery,
} from "../../../redux/api/productsApi/ProductApi";
import { useParams } from "react-router-dom";
import "./productAdd.scss";

const MAX_IMAGES = 6;
const TOKEN_EXPIRY_BUFFER = 30000;
const MAX_UPLOAD_RETRIES = 2;

const EditProductPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth?.user);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [usedTokens, setUsedTokens] = useState(new Set());

  const { data, isLoading: isProductLoading } = useGetSingleProductQuery(id);
  const productData = data?.product;

  const [uploadImage] = useUploadImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [rollbackProduct] = useRollbackProductMutation();

  const { data: initialSignature, refetch: refetchSignature } =
    useGetSignatureQuery(MAX_IMAGES, {
      refetchOnMountOrArgChange: true,
    });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      minAcceptablePrice: 0,
      price: 0,
      discount: 0,
      stock: 1,
      negotiationEnabled: "false",
    },
  });

  const price = watch("price");
  const minAcceptablePrice = watch("minAcceptablePrice");
  const discount = watch("discount");
  const negotiationEnabled = watch("negotiationEnabled");

  // Populate form and images
  // Populate form and images
  useEffect(() => {
    if (productData) {
      const transformedImages =
        productData.featureImages?.map((img) => ({
          ...img,
          file: null, // existing images don't have a file
          thumbnailUrl: img.url, // use ImageKit URL
          isNew: false, // mark as existing
        })) || [];

      setExistingImages(transformedImages);
      setImages(transformedImages);

      reset({
        name: productData.name || "",
        sku: productData.sku || "",
        manufacturer: productData.manufacturer || "",
        shortDescription: productData.shortDescription || "",
        detailsDescription: productData.detailsDescription || "",
        price: productData.price || 0,
        discount: productData.discount || 0,
        stock: productData.stock || 1,
        colors: Array.isArray(productData.colors)
          ? productData.colors.join(", ")
          : productData.colors || "",
        sizes: Array.isArray(productData.sizes)
          ? productData.sizes.join(", ")
          : productData.sizes || "",
        brand: productData.brand || "",
        category: productData.category || "",
        subcategory: productData.subcategory || "",
        slug: productData.slug || "",
        negotiationEnabled: productData.negotiationEnabled ? "true" : "false",
        minAcceptablePrice: productData.minAcceptablePrice || 0,
        sellerGuidelines: productData.sellerGuidelines || "",
      });
    }
  }, [productData, reset]);

  useEffect(() => {
    if (initialSignature) {
      setSignatureData(initialSignature);
      setUsedTokens(new Set());
    }
  }, [initialSignature]);

  useEffect(() => {
    if (price && minAcceptablePrice > price) {
      setValue("minAcceptablePrice", price);
      trigger("minAcceptablePrice");
    }
  }, [price, minAcceptablePrice, setValue, trigger]);

  const validateMinPrice = useCallback(
    (value) => {
      const numValue = Number(value);
      if (isNaN(numValue)) return "Must be a valid number";
      if (numValue < 0) return "Cannot be negative";
      if (price && numValue > price)
        return `Must be ≤ product price (${price.toFixed(2)})`;
      return true;
    },
    [price]
  );

  const validateDiscount = useCallback((value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "Must be a valid number";
    if (numValue < 0) return "Cannot be negative";
    if (numValue > 100) return "Cannot exceed 100%";
    return true;
  }, []);

  const checkAndRefreshSignature = useCallback(async () => {
    try {
      const now = Date.now();
      const needsRefresh = !signatureData?.tokens?.some(
        (token) =>
          now < token.expire * 1000 - TOKEN_EXPIRY_BUFFER &&
          !usedTokens.has(token.token)
      );

      if (needsRefresh) {
        const { data: newSignature } = await refetchSignature();
        if (!newSignature) throw new Error("No signature data received");
        setSignatureData(newSignature);
        setUsedTokens(new Set());
        return newSignature;
      }
      return signatureData;
    } catch (err) {
      console.error("Failed to refresh signature:", err);
      setError("Could not refresh upload credentials. Please try again.");
      throw err;
    }
  }, [signatureData, refetchSignature, usedTokens]);

  const isTokenError = (error) => {
    return (
      error?.status === 401 ||
      error?.data?.message?.includes("token") ||
      error.message.includes("Token")
    );
  };

  const uploadImageWithRetry = useCallback(
    async (img, index, currentSignature, retryCount = 0) => {
      try {
        if (img.url && !img.file) return img;

        const { signature, token, expire } = currentSignature.tokens[index];

        if (usedTokens.has(token)) throw new Error("Token already used");
        if (Date.now() >= expire * 1000) throw new Error("Token expired");

        const formData = new FormData();
        formData.append("file", img.file);
        formData.append("fileName", img.originalName);
        formData.append("publicKey", currentSignature.publicKey);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", token);
        formData.append("folder", "/eshop");

        setUploadProgress((prev) => ({
          ...prev,
          [index]: { status: "uploading", progress: 0 },
        }));

        const result = await uploadImage(formData).unwrap();
        if (!result?.fileId) throw new Error(`Image upload failed`);

        setUsedTokens((prev) => new Set(prev).add(token));

        setUploadProgress((prev) => ({
          ...prev,
          [index]: { status: "completed", progress: 100 },
        }));

        return {
          url: result.url,
          fileId: result.fileId,
          thumbnailUrl: result.thumbnailUrl,
        };
      } catch (err) {
        setUploadProgress((prev) => ({
          ...prev,
          [index]: {
            status: "failed",
            progress: 0,
            error: err.message.includes("token") ? "Token issue" : err.message,
          },
        }));

        if (isTokenError(err) && retryCount < MAX_UPLOAD_RETRIES) {
          const refreshedSignature = await checkAndRefreshSignature();
          return uploadImageWithRetry(
            img,
            index,
            refreshedSignature,
            retryCount + 1
          );
        }
        throw err;
      }
    },
    [uploadImage, checkAndRefreshSignature, usedTokens]
  );

  const onSubmit = useCallback(
    async (data) => {
      setError(null);
      setSuccess(null);

      if (!images.length) {
        setError("Please upload at least one image");
        return;
      }

      setIsProcessingImages(true);
      setUploadProgress({});
      let uploadedImages = [];

      try {
        const currentSignature = await checkAndRefreshSignature();
        if (!currentSignature?.tokens) {
          setError("Upload credentials unavailable");
          return;
        }

        uploadedImages = await Promise.all(
          images.map((img, index) => {
            if (img.file)
              return uploadImageWithRetry(img, index, currentSignature);
            return img;
          })
        );

        const updateData = {
          ...data,
          featureImages: uploadedImages,
          negotiationEnabled: data.negotiationEnabled === "true",
          colors: data.colors
            ? data.colors
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            : [],
          sizes: data.sizes
            ? data.sizes
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        };

        await updateProduct({ id, ...updateData }).unwrap();
        setSuccess("Product updated successfully!");
      } catch (err) {
        console.error("Product update failed:", err);
        const errorMessage =
          err?.data?.message || err.message || "Failed to update product";
        setError(errorMessage);

        // Rollback newly uploaded images
        try {
          const imagesToRollback = uploadedImages
            .filter(
              (img) =>
                img.fileId &&
                !existingImages.some((ei) => ei.fileId === img.fileId)
            )
            .map((img) => ({ fileId: img.fileId }));

          if (imagesToRollback.length > 0) {
            await rollbackProduct({ images: imagesToRollback }).unwrap();
          }
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      } finally {
        setIsProcessingImages(false);
      }
    },
    [
      images,
      checkAndRefreshSignature,
      uploadImageWithRetry,
      updateProduct,
      rollbackProduct,
      id,
      existingImages,
    ]
  );

  const productFields = useMemo(() => {
    const baseFields = [
      {
        name: "name",
        label: "Product Name",
        type: "text",
        validation: {
          required: "Product name is required",
          minLength: {
            value: 4,
            message: "Name must be at least 4 characters",
          },
          maxLength: {
            value: 100,
            message: "Name cannot exceed 100 characters",
          },
        },
      },
      {
        name: "sku",
        label: "SKU",
        type: "text",
        validation: {
          maxLength: { value: 50, message: "SKU cannot exceed 50 characters" },
        },
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        type: "text",
        validation: {
          maxLength: {
            value: 100,
            message: "Manufacturer name cannot exceed 100 characters",
          },
        },
      },
      {
        name: "shortDescription",
        label: "Short description",
        type: "textarea",
        rows: 3,
        validation: {
          required: "Short description is required",
          maxLength: {
            value: 300,
            message: "Short description cannot exceed 300 characters",
          },
        },
      },
      {
        name: "detailsDescription",
        label: "Details description",
        type: "textarea",
        rows: 4,
        validation: {
          required: "Details description is required",
          maxLength: {
            value: 1000,
            message: "Details description cannot exceed 1000 characters",
          },
        },
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        validation: {
          required: "Price is required",
          min: { value: 0.01, message: "Price must be at least 0.01" },
          valueAsNumber: true,
          onChange: (e) => {
            const newPrice = Number(e.target.value);
            if (!isNaN(newPrice)) {
              if (minAcceptablePrice > newPrice)
                setValue("minAcceptablePrice", newPrice);
              trigger("minAcceptablePrice");
            }
          },
        },
      },
      {
        name: "discount",
        label: "Discount (%)",
        type: "number",
        validation: { validate: validateDiscount, valueAsNumber: true },
      },
      {
        name: "stock",
        label: "Stock",
        type: "number",
        validation: {
          required: "Stock quantity is required",
          min: { value: 1, message: "Stock must be at least 1" },
          valueAsNumber: true,
        },
      },
      {
        name: "colors",
        label: "Color (comma separated)",
        type: "text",
        validation: {
          maxLength: {
            value: 100,
            message: "Color list cannot exceed 100 characters",
          },
        },
      },
      {
        name: "sizes",
        label: "Size (comma separated)",
        type: "text",
        validation: {
          maxLength: {
            value: 100,
            message: "Size list cannot exceed 100 characters",
          },
        },
      },
      {
        name: "brand",
        label: "Brand",
        type: "text",
        validation: {
          maxLength: {
            value: 50,
            message: "Brand name cannot exceed 50 characters",
          },
        },
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        validation: { required: "Category is required" },
      },
      {
        name: "subcategory",
        label: "Subcategory",
        type: "text",
        validation: {
          required: "Subcategory is required",
          maxLength: {
            value: 100,
            message: "Subcategory cannot exceed 100 characters",
          },
        },
      },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        validation: {
          required: "Slug is required",
          minLength: {
            value: 2,
            message: "Slug must be at least 2 characters",
          },
          maxLength: {
            value: 100,
            message: "Slug cannot exceed 100 characters",
          },
          pattern: {
            value: /^[a-z0-9-]+$/,
            message:
              "Slug can only contain lowercase letters, numbers, and hyphens",
          },
        },
      },
      {
        name: "negotiationEnabled",
        label: "Negotiate price Enabled",
        type: "select",
        validation: { required: "Negotiation enabled is required" },
        options: [
          { label: "NO", value: "false" },
          { label: "YES", value: "true" },
        ],
      },
    ];

    if (negotiationEnabled === "true") {
      baseFields.push(
        {
          name: "minAcceptablePrice",
          label: "Min Acceptable Price",
          type: "number",
          validation: {
            required: "Minimum acceptable price is required",
            validate: validateMinPrice,
            valueAsNumber: true,
          },
        },
        {
          name: "sellerGuidelines",
          label: "Seller Guidelines",
          type: "textarea",
          rows: 3,
          validation: {
            required: "Seller guidelines are required",
            minLength: {
              value: 10,
              message: "Guidelines must be at least 10 characters",
            },
            maxLength: {
              value: 500,
              message: "Guidelines cannot exceed 500 characters",
            },
          },
        }
      );
    }

    return baseFields;
  }, [
    minAcceptablePrice,
    setValue,
    trigger,
    negotiationEnabled,
    validateDiscount,
    validateMinPrice,
  ]);

  const renderFormField = useCallback(
    (field) => {
      const { name, label, type = "text", rows, validation, options } = field;
      const isRequired = validation?.required;
      const commonProps = {
        ...register(name, validation),
        isInvalid: !!errors[name],
        className: errors[name] ? "is-invalid" : "",
      };

      return (
        <Form.Group className="mb-3" key={name} controlId={name}>
          <Form.Label>
            {label}
            {isRequired && <span className="text-danger">*</span>}
          </Form.Label>

          {type === "textarea" ? (
            <Form.Control as="textarea" rows={rows || 3} {...commonProps} />
          ) : type === "select" ? (
            <Form.Select {...commonProps}>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type={type}
              step={type === "number" ? "0.01" : undefined}
              {...commonProps}
            />
          )}

          <Form.Control.Feedback type="invalid" className="d-block">
            {errors[name]?.message}
          </Form.Control.Feedback>

          {name === "minAcceptablePrice" && price && (
            <Form.Text className="text-muted">
              Must be between 0 and {price.toFixed(2)}
            </Form.Text>
          )}
          {name === "discount" && (
            <Form.Text className="text-muted">
              Enter a percentage between 0 and 100
            </Form.Text>
          )}
          {name === "slug" && (
            <Form.Text className="text-muted">
              Lowercase letters, numbers, and hyphens only
            </Form.Text>
          )}
        </Form.Group>
      );
    },
    [register, errors, price]
  );

  if (isProductLoading) {
    return (
      <div className="py-4 d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="px-3">
          <Col xs={12} md={6} className="my-3 p-0 px-md-3">
            <ImageUpload
              images={images}
              setImages={setImages}
              MAX_IMAGES={MAX_IMAGES}
              uploadProgress={uploadProgress}
              existingImages={existingImages}
            />
            {!images.length && (
              <Alert variant="danger" className="mt-2">
                Please upload at least one product image
              </Alert>
            )}
          </Col>

          <Col xs={12} md={6} className="bg-white p-4 shadow rounded my-3">
            {productFields.map(renderFormField)}
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={isSubmitting || !images.length || isProcessingImages}
            >
              {isSubmitting || isProcessingImages ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isProcessingImages
                    ? "Processing Images..."
                    : "Updating Product..."}
                </>
              ) : (
                "Update Product"
              )}
            </Button>
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mt-2">
                {success}
              </Alert>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EditProductPage;
