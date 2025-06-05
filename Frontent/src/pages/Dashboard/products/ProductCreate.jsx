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
import ImageUpLoad from "../../../components/Dashboard/productAddPage/ImageUpLoad";
import {
  useGetSignatureQuery,
  useUploadImageMutation,
  useCreateProductMutation,
  useRollbackProductMutation,
} from "../../../redux/api/productsApi/ProductApi";
import ShowToast from '../../../components/SubComponent/Showtoast'
import "./productAdd.scss";
const MAX_IMAGES = 6;

const AddProductPage = () => {
  const user = useSelector((state) => state.auth?.user);
  const [images, setImages] = useState([]);
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // API hooks
  const [uploadImage] = useUploadImageMutation();
  const [createProduct] = useCreateProductMutation();
  const [rollbackProduct] = useRollbackProductMutation();
  const {
    data: initialSignature,
    isLoading: isInitialLoading,
    error: initialError,
    refetch: refetchSignature,
  } = useGetSignatureQuery(images.length, {
    refetchOnMountOrArgChange: true,
  });

  // Store signature data when it loads
  useEffect(() => {
    if (initialSignature && !initialError) {
      setSignatureData(initialSignature);
    } else if (initialError) {
      setError("Failed to load upload credentials. Please refresh the page.");
    }
  }, [initialSignature, initialError]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
    setValue,
    trigger,
    clearErrors,
    getValues,
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

  // Watch important fields for dependent validation
  const price = watch("price");
  const minAcceptablePrice = watch("minAcceptablePrice");
  const discount = watch("discount");
  const negotiationEnabled = watch("negotiationEnabled");
const RemoveBG=watch("Remove Background")

  // Validate minAcceptablePrice against current price
  const validateMinPrice = (value) => {
    const numValue = Number(value);
    const currentPrice = Number(price);

    if (isNaN(numValue)) return "Must be a valid number";
    if (numValue < 0) return "Cannot be negative";
    if (currentPrice && numValue > currentPrice) {
      return `Must be less than or equal to product price (${currentPrice.toFixed(2)})`;
    }
    return true;
  };

  // Validate discount percentage
  const validateDiscount = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "Must be a valid number";
    if (numValue < 0) return "Cannot be negative";
    if (numValue > 100) return "Cannot exceed 100%";
    return true;
  };

  // Validate at least one description exists
  const validateDescriptions = (data) => {
    const { shortDescription, description } = data;
    if (!shortDescription && !description) {
      return "At least one description (short or full) is required";
    }
    return null;
  };

 useEffect(() => {
    if (error) {
      ShowToast('error', error, 'top-right');
      setError(null); // clear error after showing
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      ShowToast('success', success, 'top-right');
      setSuccess(null); // clear success after showing
    }
  }, [success]);


  // Update minAcceptablePrice when price changes
  useEffect(() => {
    if (price && minAcceptablePrice > price) {
      setValue("minAcceptablePrice", price);
    }
    trigger("minAcceptablePrice");
  }, [price, minAcceptablePrice, setValue, trigger]);

  // Clear specific error when user starts typing
  const handleInputChange = (fieldName) => (e) => {
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);

    // Validate descriptions
    const descriptionError = validateDescriptions(data);
    if (descriptionError) {
      setError(descriptionError);
      return;
    }

    if (!images.length) {
      setError("Please upload at least one image");
      return;
    }

    try {
      const currentSignature = await checkAndRefreshSignature();

      if (!currentSignature || !currentSignature.tokens) {
        setError("Upload credentials unavailable. Try again later.");
        return;
      }

      const { tokens, publicKey } = currentSignature;

      if (tokens.length < images.length) {
        setError("Not enough upload tokens received. Try again.");
        return;
      }

      const uploadedImages = await Promise.all(
        images.map(async (img, index) => {
          const { signature, token, expire } = tokens[index];
          const formData = new FormData();
          formData.append("file", img.file);
          formData.append("fileName", data.name || img.name);
          formData.append("publicKey", publicKey);
          formData.append("signature", signature);
          formData.append("expire", expire);
          formData.append("token", token);
          formData.append("folder", "/eshop");

          try {
            const result = await uploadImage(formData).unwrap();
            if (!result) {
              throw new Error(`Image upload failed for image ${index + 1}`);
            }
            return result;
          } catch (error) {
            console.error(`Error uploading image ${index + 1}:`, error);
            setError(`Failed to upload image ${index + 1}. Please try again.`);
            throw error;
          }
        })
      );

      const payload = {
        ...data,
        featureImages: uploadedImages,
        negotiationEnabled: data.negotiationEnabled === "true",
      };

      await createProduct(payload).unwrap();
      setSuccess("Product created successfully!");
      reset();
      setImages([]);
      setSignatureData(null);
    } catch (err) {
      console.error("❌ Product creation failed:", err);
      setSignatureData(null);
      setError(err?.message || "Failed to create product. Please try again.");

      try {
        await rollbackProduct({ images, productData: data }).unwrap();
        console.log("⚠️ Rollback successful due to an error.");
      } catch (rollbackError) {
        console.error("⚠️ Rollback also failed:", rollbackError);
        setError((prev) => `${prev} Rollback failed. Please contact support.`);
      }
    }
  };

  // Check and refresh signature function
  const checkAndRefreshSignature = useCallback(async () => {
    const now = Date.now();
    const isExpired =
      !signatureData ||
      !signatureData.tokens ||
      signatureData.tokens.some((token) => now >= token.expire * 1000);

    if (isExpired) {
      try {
        const { data: newSignature, error: refetchError } =
          await refetchSignature();
        if (refetchError) {
          throw new Error(
            refetchError.message || "Failed to refresh signature"
          );
        }
        if (newSignature) {
          setSignatureData(newSignature);
          return newSignature;
        }
        throw new Error("No signature data received");
      } catch (err) {
        console.error("⚠️ Failed to refresh signature:", err);
        setError(
          "Could not refresh image upload credentials. Please try again."
        );
        throw err;
      }
    }

    return signatureData;
  }, [signatureData, refetchSignature]);

  // Memoized product fields with conditional negotiation fields
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
          maxLength: {
            value: 50,
            message: "SKU cannot exceed 50 characters",
          },
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
      // {
      //   name: "shortDescription",
      //   label: "Short Description",
      //   type: "textarea",
      //   rows: 2,
      //   validation: {
      //     maxLength: {
      //       value: 200,
      //       message: "Short description cannot exceed 200 characters",
      //     },
      //   },
      // },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        require:true,
        rows: 4,
        validation: {
          required:"description is required",
          maxLength: {
            value: 1000,
            message: "Description cannot exceed 1000 characters",
          },
        },
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        validation: {
          required: "Price is required",
          min: {
            value: 0.01,
            message: "Price must be at least 0.01",
          },
          valueAsNumber: true,
          onChange: (e) => {
            const newPrice = Number(e.target.value);
            if (!isNaN(newPrice)) {
              if (minAcceptablePrice > newPrice) {
                setValue("minAcceptablePrice", newPrice);
              }
              trigger("minAcceptablePrice");
            }
          },
        },
      },
      {
        name: "discount",
        label: "Discount (%)",
        type: "number",
        validation: {
          validate: validateDiscount,
          valueAsNumber: true,
        },
      },
      {
        name: "stock",
        label: "Stock",
        type: "number",
        validation: {
          required: "Stock quantity is required",
          min: {
            value: 1,
            message: "Stock must be at least 1",
          },
          valueAsNumber: true,
        },
      },
      {
        name: "color",
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
        name: "size",
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
        validation: {
          required: "Category is required",
        },
      },
      {
        name: "subcategory",
        label: "Subcategory",
        required: true,
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
            message: "Slug can only contain lowercase letters, numbers, and hyphens",
          },
        },
      },
      {
        name: "negotiationEnabled",
        label: "Negotiate price Enabled",
        type: "select",
        validation: {
          required: "Negotiation enabled is required",
        },
        options: [
          {
            label: "NO",
            value: "false",
          },
          {
            label: "YES",
            value: "true",
          },
        ],
      },
      {
      name: "removeBackground",
      type: "checkbox",
      validation: {},
      onChange: (e) => {
        setValue("removeBackground", e.target.checked, { shouldValidate: true });
      }
    }
    ];

    // Only add negotiation-related fields if negotiation is enabled
    if (negotiationEnabled === "true") {
      const bgrm=baseFields.pop();
      baseFields.push(
        {
          name: "minAcceptablePrice",
          label: "Min Acceptable Price",
          required: true,
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
          required: true,
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
      baseFields.push(bgrm);
    }

    

    return baseFields;
  }, [minAcceptablePrice, setValue, trigger, negotiationEnabled]);

  // Render form field function
  const renderFormField = useCallback(
    (field) => {
      const { name, label, type = "text", rows, validation } = field;
      const isRequired = validation?.required;
      const isTextarea = type === "textarea";
      const isSelect = type === "select";
      const isCheckbox = type === "checkbox";
      return (
        <Form.Group className="mb-3" key={name} controlId={name}>
          <Form.Label>
            {label}
            {isRequired && <span className="text-danger">*</span>}
          </Form.Label>

          {isTextarea ? (
            <Form.Control
              as="textarea"
              rows={rows || 3}
              {...register(name, validation)}
              isInvalid={!!errors[name]}
              className={errors[name] ? "is-invalid" : ""}
            />
          ) : isSelect ? (
            <Form.Select
              {...register(name, validation)}
              isInvalid={!!errors[name]}
              className={errors[name] ? "is-invalid" : ""}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          ) : isCheckbox ?(
            <Form.Check
              type="checkbox"
              label={name}
              {...register(name, validation)}
              isInvalid={!!errors[name]}
              className={errors[name] ? "is-invalid" : ""}              
            />)
          : (
            <Form.Control
              type={type}
              step={type === "number" ? "0.01" : undefined}
              {...register(name, validation)}
              isInvalid={!!errors[name]}
              className={errors[name] ? "is-invalid" : ""}
            />
          )}

          <Form.Control.Feedback type="invalid" className="d-block">
            {errors[name]?.message}
          </Form.Control.Feedback>

          {/* Additional help text for specific fields */}
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

  if (isInitialLoading) {
    return (
      <div
        fluid
        className="py-4 d-flex justify-content-center align-items-center vh-100 vw-100 "
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row style={{ paddingLeft: "12px", paddingRight: "12px" }}>
          {/* Image Upload */}
          <Col
            xs={{ span: 12, order: 1 }}
            md={{ span: 6, order: 2 }}
            className="my-3 p-0 px-md-3"
          >
            <ImageUpLoad
              images={images}
              setImages={setImages}
              MAX_IMAGES={MAX_IMAGES}
            bgRemovalEnabled={watch("removeBackground")}    
            />
            {!images.length && (
              <Alert variant="danger" className="mt-2">
                Please upload at least one product image
              </Alert>
            )}
          </Col>

          {/* Form Fields */}
          <Col
            xs={{ span: 12, order: 2 }}
            md={{ span: 6, order: 1 }}
            className="bg-white p-4 shadow rounded my-3"
          >
            {productFields.map((field) => renderFormField(field))}
     
            <Button
              type="submit"
              variant="primary"
              style={{ width: "100%" }}
              disabled={isSubmitting || !images.length}
            >
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <i className="bi bi-box-seam"></i>
                  <span> Create Product</span>
                </>
              )}
            </Button>
          </Col>
        </Row>

        {/* Error and Success Messages */}
        {error && (
          <Row className="mt-3">
            <Col>
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
              >
                {error}
              </Alert>
            </Col>
          </Row>
          
        )}

        {success && (
          <Row className="mt-3">
            <Col>
              <Alert
                variant="success"
                onClose={() => setSuccess(null)}
                dismissible
              >
                {success}
              </Alert>
            </Col>
          </Row>
        )}
      </Form>
    </Container>
  );
};

export default React.memo(AddProductPage);