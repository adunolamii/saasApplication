"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Header";
import EmailTable from "./EmailTable";
import DeleteSub from "./DeleteSub";
import Sub from "./Sub"
// import { ToastContainer, Toast } from '@shadcn/ui';
// import { X } from 'react-feather'; // For the close icon

const EmailForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleToggleChange = () => {
    setEmailNotifications((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the userEmail is not empty
    if (!userEmail) {
      setError("Email is required");
      return;
    }

    const userId = "605c72ef1532075b18ed89f6"; // Use the appropriate userId here
   
    try {
      // Send POST request to backend to add the email settings
      const response = await axios.post("/api/email", {
        userId,
        userEmail,
        emailNotifications,
      });

      setSuccess("Email added and notification sent successfully");
      setError(null); // Reset error if request is successful
    } catch (err) {
      setSuccess(null); // Reset success message if there was an error
      setError("Error adding email or sending notification");
      console.error(err);
    }
  };
// SUB BACKEND POST req
  const [userId, setUserId] = useState('');
  const [stripeCustomerId, setStripeCustomerId] = useState('');
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState('');
  const [planId, setPlanId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Ensure all fields are filled
    if (!userId || !stripeCustomerId || !stripeSubscriptionId || !planId) {
      setMessage('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/subscription', {
        userId,
        stripeCustomerId,
        stripeSubscriptionId,
        planId,
      });

      setMessage(response.data.msg);
      setLoading(false);
    } catch (error) {
      setMessage('Failed to create subscription');
      setLoading(false);
      console.error('Error creating subscription:', error);
    }
  };

  // SUB GET req
  const [subscriptions, setSubscriptions] = useState([]);
 
  // const userId = "605c72ef1532075b18ed89f6"; // Replace with dynamic userId from your app

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(`/api/subscription?userId=${userId}`);
        
        if (response.data.subscriptions) {
          setSubscriptions(response.data.subscriptions);
        } else {
          setError("No subscriptions found.");
        }
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setError("Failed to fetch subscriptions");
      }
    };

    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);
  // DELETE SUB





  return (
   <div className="email-form">
        {/* <Header/> */}
     {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Email Notification Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <label
              htmlFor="userEmail"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Notification Toggle */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <label
              htmlFor="emailNotifications"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Enable Email Notifications
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-gray-500">Off</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <span className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer-checked:bg-indigo-600"></span>
                <span className="absolute left-1 top-0.5 text-xs text-white peer-checked:left-6 peer-checked:text-indigo-100 transition-all duration-200">
                  {emailNotifications ? "On" : "Off"}
                </span>
              </label>
              <span className="text-gray-500">On</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
      {/* SUB FOR BACKEND */}
       <div className="w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center">Create Subscription</h2>
      
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter User ID"
          />
        </div>

        <div>
          <label htmlFor="stripeCustomerId" className="block text-sm font-medium">Stripe Customer ID</label>
          <input
            type="text"
            id="stripeCustomerId"
            value={stripeCustomerId}
            onChange={(e) => setStripeCustomerId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Stripe Customer ID"
          />
        </div>

        <div>
          <label htmlFor="stripeSubscriptionId" className="block text-sm font-medium">Stripe Subscription ID</label>
          <input
            type="text"
            id="stripeSubscriptionId"
            value={stripeSubscriptionId}
            onChange={(e) => setStripeSubscriptionId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Stripe Subscription ID"
          />
        </div>

        <div>
          <label htmlFor="planId" className="block text-sm font-medium">Plan ID</label>
          <input
            type="text"
            id="planId"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Plan ID"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          {loading ? 'Submitting...' : 'Create Subscription'}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
{/* GET REQ */}
<div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Subscriptions</h1>

      {/* Pass subscriptions and error to SubscriptionList component */}
      <EmailTable subscriptions={subscriptions} error={error} />
    </div>   
    {/* DELETE */}
    <DeleteSub/>
    <Sub/>
    
     </div>
  );
};

export default EmailForm;
