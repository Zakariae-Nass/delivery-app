/**
 * useRegister.js
 *
 * Couche métier pour l'inscription.
 * Orchestre : appel service → retourne { success } au screen.
 */

import { useState } from 'react';
import { authService } from '../services/auth.service';

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleRegister = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, setError };
}
