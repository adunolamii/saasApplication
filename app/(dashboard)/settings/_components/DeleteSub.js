import { useState } from 'react';
import axios from 'axios';

const ManageSubscription = ({ subscriptionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Send DELETE request with subscriptionId to cancel the subscription
      const response = await axios.delete(`/api/subscription/${subscriptionId}`);

      // Show success message if the subscription was canceled
      alert('Subscription canceled successfully');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-4">Manage Your Subscription</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        className={`mt-4 px-4 py-2 bg-red-500 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
        onClick={handleCancel}
        disabled={loading}
      >
        {loading ? 'Canceling...' : 'Cancel Subscription'}
      </button>
    </div>
  );
};

export default ManageSubscription;
