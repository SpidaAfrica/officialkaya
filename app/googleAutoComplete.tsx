"use client";
import React, { useState } from "react";
import { useGooglePlacesAutocomplete } from "./useGooglePlacesAutocomplete"; // adjust path!

type GoogleAutocompleteProps = {
  placeholder?: string;
  onPlaceSelected: (place: { lat: number; lng: number; description: string }) => void;
  className?: string;
};

const GoogleAutocomplete = ({ placeholder, onPlaceSelected, className }: GoogleAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const { suggestions, loading, searchPlaces, geocodeByPlaceId } = useGooglePlacesAutocomplete();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    searchPlaces(value);
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    try {
      const coords = await geocodeByPlaceId(suggestion.place_id);
      onPlaceSelected({
        lat: coords.lat,
        lng: coords.lng,
        description: suggestion.description,
      });
      setInputValue(suggestion.description);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={`border border-gray-300 rounded px-4 py-2 w-full ${className}`}
      />
      {loading && <div className="absolute mt-1 bg-white text-black text-sm px-2">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white w-full text-black mt-1 max-h-60 overflow-y-auto shadow-md rounded z-50">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleAutocomplete;
