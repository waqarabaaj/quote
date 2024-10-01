import React, { useState, useEffect } from 'react';

const GetQuoteForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    universal_leadid: '',
    tcpaConsent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.id = 'LeadiDscript';
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//create.lidstatic.com/campaign/620fff68-8b52-6dc4-ab7c-9b6528fcd444.js?snippet_version=2&f=reset';
    
    // Append the script to the document
    document.body.appendChild(script);

    // Function to capture the output and set it in formData
    script.onload = () => {
      // Assuming the script sets a global variable or ID that we can access
      const leadId = document.getElementById('leadid_token')?.value;
      if (leadId) {
        setFormData((prevData) => ({
          ...prevData,
          universal_leadid: leadId,
        }));
      }
    };

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-center text-3xl font-bold mb-8">Get Quote</h2>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {/* First Name and Last Name in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <input id="leadid_token" name="universal_leadid" type="hidden" value={formData.universal_leadid} />

          {/* TCPA Consent */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="tcpaConsent"
              checked={formData.tcpaConsent}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-justify text-gray-600">
              By submitting this form, you agree to the{" "}
              <a href="#" className="text-blue-500 underline">Terms and Conditions</a> and{" "}
              <a href="#" className="text-blue-500 underline">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default GetQuoteForm;
