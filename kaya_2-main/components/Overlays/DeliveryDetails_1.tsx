"use client";

import React from "react";
import { Phone } from "lucide-react"; // import Lucide phone icon

interface Delivery {
  id: number;
  created_at: string;
  to_location: string;
  delivery_id: string;
  price: string;
  status: string;
  rider: string;
  rider_image: string;
  rider_phone: string;
  rider_name: string;
  bank_name: string;
  account_number: string;
}

interface DeliveryDetailsProps {
  delivery: Delivery;
  onClose: () => void;
}

export const DeliveryDetails_1: React.FC<DeliveryDetailsProps> = ({ delivery, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Delivery Details</h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-medium">Order ID:</span> {delivery.delivery_id}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                delivery.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {delivery.status}
            </span>
          </div>
          <div>
            <span className="font-medium">To Location:</span> {delivery.to_location}
          </div>
          <div>
            <span className="font-medium">Price:</span> ₦{delivery.price}
          </div>
          <div>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(delivery.created_at).toLocaleString()}
          </div>

          {/* Rider Section */}
          <div className="flex items-center gap-3 mt-4 border-t pt-4">
            <img
              src={delivery.rider_image}
              alt="Rider"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{delivery.rider_name}</span>
              <a
                href={`tel:${delivery.rider_phone}`}
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
              >
                <Phone size={14} className="text-blue-600" />
                {delivery.rider_phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
