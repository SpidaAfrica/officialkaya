"use client";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export const useGooglePlacesAutocomplete = () => {
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDeiTX6cfrRVrGA1wJnZh_ro957siC6A1c&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        setAutocompleteService(new window.google.maps.places.AutocompleteService());
      };
    } else {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  const searchPlaces = (input: string) => {
    if (!input || !autocompleteService) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    autocompleteService.getPlacePredictions(
      { input },
      (predictions: any[], status: string) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const geocodeByPlaceId = (placeId: string): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject("Failed to get geocode");
        }
      });
    });
  };

  return { suggestions, loading, searchPlaces, geocodeByPlaceId };
};
