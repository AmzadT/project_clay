import React from "react";
import DynamicForm from "./Components/DynamicForm";

const schema = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    placeholder: "Enter your password",
  },

  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },

  {
    name: "workExperience",
    label: "",
    type: "section",
    fields: [
      {
        name: "company",
        label: "Company Name",
        type: "text",
        placeholder: "Enter company name",
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        placeholder: "Enter your role",
      },
      {
        name: "yearsExperience",
        label: "Years of Experience",
        type: "select",
        options: ["0-1", "1-3", "3-5", "5-10", "10+"],
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "Enter job location",
      },
    ],
  },
];

function App() {
  return (
    <div
      style={{
        width: "50%",
        margin: "auto",
        border: "1px solid gray",
        borderRadius: "5px",
        padding: "20px",
        maxWidth: "600px", 
        minWidth: "300px", 
        "@media (max-width: 768px)": { width: "100%" },
      }}
    >
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
            Registration Form
          </h2>
          <DynamicForm
            schema={schema}
            onSubmit={(data) => console.log("Form Data:", data)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
