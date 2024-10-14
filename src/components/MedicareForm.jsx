import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const MedicareForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    zipCode: "",
    city: "",
    state: "",
    dob: "",
    age: "",
    email: "",
    universal_leadid: "",
    tcpaConsent: false,
    ipAddress: "",
  });

  const formRef = useRef(null);

  useEffect(() => {
    const scriptId = "LeadiDscript";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "//create.lidstatic.com/campaign/bf1edbfe-9a9d-9c5c-6e14-f3d1bde74fe6.js?snippet_version=2";

      document.body.appendChild(script);

      script.onload = () => {
        console.log("LeadiD script loaded successfully");

        // Set an interval to check for the lead ID token
        const checkLeadId = setInterval(() => {
          const leadId = document.getElementById("leadid_token")?.value;
          if (leadId) {
            setFormData((prevData) => ({
              ...prevData,
              universal_leadid: leadId,
            }));
            clearInterval(checkLeadId); // Stop checking once lead ID is found
          }
        }, 1000); // Check every second
      };
    }

    // Clean up the script when the component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Function to fetch city and state based on zip code
  const getCityAndStateFromZip = async (zipCode) => {
    if (zipCode.length === 5) {
      try {
        const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
        if (response.status === 200) {
          const { "place name": cityName, state } = response.data.places[0];
          setFormData((prevData) => ({
            ...prevData,
            city: cityName,
            state,
          }));
        }
      } catch (error) {
        console.error("Error fetching city/state:", error);
        alert("Unable to fetch city and state. Please check the ZIP code.");
      }
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "zipCode") {
      getCityAndStateFromZip(value);
    }
  };

  // Calculate age from DOB
  const handleDobChange = (e) => {
    const dob = e.target.value;
    setFormData({ ...formData, dob });

    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prevData) => ({ ...prevData, age }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-gray-50 flex justify-center py-12">
      <form
        ref={formRef}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Explore Medicare Advantage Plans Options in Your Area
        </h1>
        <h2 className="text-xl font-semibold text-center mb-8">Get a Quote</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            placeholder="State"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleDobChange}
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="text"
            name="age"
            value={formData.age}
            readOnly
            placeholder="Age"
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-3 rounded w-full"
          />
        </div>
        {/* Hidden Input Field */}
        <input
          id="leadid_token"
          name="universal_leadid"
          type="hidden"
          value={formData.universal_leadid}
        />

        <div className="my-4">
          <label className="inline-flex items-start text-sm text-gray-600">
            <input
              type="checkbox"
              name="tcpaConsent"
              checked={formData.tcpaConsent}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2">
              By submitting this form, you agree to the{" "}
              <a href="#" className="text-blue-500 underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MedicareForm;
