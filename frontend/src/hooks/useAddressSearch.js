import { useState, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import * as locationService from '../services/location.service';

function shortFromText(text) {
  return text.split(',').slice(0, 2).join(',').trim();
}

export default function useAddressSearch({ initialValue, onAddressSelected, onAddressCleared }) {
  const [inputText,       setInputText]       = useState('');
  const [suggestions,     setSuggestions]     = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [selected,        setSelected]        = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // React to initialValue changes (GPS pre-fill)
  useEffect(() => {
    if (initialValue?.lat) {
      const shortName = shortFromText(initialValue.text);
      setSelected({
        text:      initialValue.text,
        lat:       initialValue.lat,
        lng:       initialValue.lng,
        shortName,
      });
      setInputText(shortName);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [initialValue]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Nominatim search via service
  const doSearch = async (text) => {
    setLoading(true);
    try {
      const results = await locationService.searchAddress(text);
      if (results.length === 0) {
        setSuggestions([{ id: 'noresult', noResult: true }]);
      } else {
        setSuggestions(results);
      }
      setShowSuggestions(true);
    } catch {
      setSuggestions([{ id: 'noresult', noResult: true }]);
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  };

  // Text change handler with debounce
  const handleChangeText = (text) => {
    setInputText(text);
    setSelected(null);
    onAddressCleared();

    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(text), 500);
  };

  // Select a suggestion
  const handleSelect = (suggestion) => {
    if (suggestion.noResult) return;
    setSelected(suggestion);
    setInputText(suggestion.shortName);
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressSelected({ text: suggestion.text, lat: suggestion.lat, lng: suggestion.lng });
    Keyboard.dismiss();
  };

  // Edit (clear selection)
  const handleEdit = () => {
    setSelected(null);
    setInputText('');
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressCleared();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return {
    inputText,
    suggestions,
    loading,
    selected,
    showSuggestions,
    inputRef,
    handleChangeText,
    handleSelect,
    handleEdit,
  };
}
