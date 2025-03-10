import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControlLabel,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const DynamicForm = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    const traverseSchema = (fields) => {
      fields.forEach((field) => {
        if (field.type === "text" && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
          valid = false;
        }
        if (field.name === "email" && formData[field.name]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[field.name])) {
            newErrors[field.name] = "Invalid email format";
            valid = false;
          }
        }
        if (field.type === "section") {
          traverseSchema(field.fields);
        }
      });
    };

    traverseSchema(schema);

    if (!termsAccepted) {
      newErrors.terms = "You must accept the Terms & Conditions";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      try {
        await axios.post("{api_url}/posts", formData);
        onSubmit(formData);
      } catch (error) {
        console.error("Error submitting form", error);
      }
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg text-center border border-gray-200">
        <Typography variant="h5" className="text-green-600 font-bold">
          Thank you!
        </Typography>
        <Typography variant="body1" className="mt-2">
          Your form has been submitted successfully.
        </Typography>
      </div>
    );
  }

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || ""}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      case "select":
        return (
          <FormControl fullWidth variant="outlined">
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={!!errors[field.name]}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "section":
        return (
          <div className="p-6 border border-gray-300 rounded-lg space-y-4 bg-gray-50">
            <Typography
              variant="h6"
              className="mb-3 font-semibold text-gray-800"
            >
              {field.label}
            </Typography>
            {field.fields.map((nestedField) => (
              <div key={nestedField.name} className="mb-4">
                <Typography
                  variant="body1"
                  className="font-medium mb-1 text-gray-700"
                >
                  {nestedField.label}
                </Typography>
                {renderField(nestedField)}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white shadow-lg rounded-lg space-y-6 max-w-2xl mx-auto w-2/3 md:w-full border border-gray-200"
    >
      {schema.map((field) => (
        <div key={field.name} className="space-y-2">
          {field.type !== "checkbox" && (
            <Typography variant="body1" className="font-medium text-gray-700">
              {field.label}
            </Typography>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <Typography color="error">{errors[field.name]}</Typography>
          )}
        </div>
      ))}

      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        }
        label="I agree to the Terms & Conditions"
      />
      {errors.terms && (
        <Typography color="error" className="text-red-600">
          {errors.terms}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className="py-2"
      >
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
