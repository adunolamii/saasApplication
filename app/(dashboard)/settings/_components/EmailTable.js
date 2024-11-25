import React from 'react'

const EmailTable = ({ subscriptions, error }) => {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (subscriptions.length === 0) {
    return <p className="text-gray-500">No subscriptions available.</p>;
  }
  return (
    <div>EmailTable
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((sub) => (
        <div key={sub._id} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Plan: {sub.planId}</h2>
          <p>Status: {sub.status}</p>
          <p>Subscription Date: {new Date(sub.subscriptionDate).toLocaleDateString()}</p>
          {sub.cancelAt && <p>Cancel At: {new Date(sub.cancelAt).toLocaleDateString()}</p>}
        </div>
      ))}
    </div>

    </div>
  )
}

export default EmailTable