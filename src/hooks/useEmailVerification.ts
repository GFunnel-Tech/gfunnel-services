import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "verified_email";

interface UseEmailVerificationOptions {
  onVerify?: (email: string) => Promise<boolean>;
}

export const useEmailVerification = (options: UseEmailVerificationOptions = {}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check for stored verification on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setVerifiedEmail(stored);
      setIsVerified(true);
    }
  }, []);

  const verify = useCallback(async (email: string): Promise<boolean> => {
    // If custom verification function provided, use it
    if (options.onVerify) {
      const success = await options.onVerify(email);
      if (success) {
        sessionStorage.setItem(STORAGE_KEY, email);
        setVerifiedEmail(email);
        setIsVerified(true);
        setShowModal(false);
        return true;
      }
      return false;
    }

    // Default: just store the email (no validation)
    sessionStorage.setItem(STORAGE_KEY, email);
    setVerifiedEmail(email);
    setIsVerified(true);
    setShowModal(false);
    return true;
  }, [options]);

  const requireVerification = useCallback(() => {
    if (!isVerified) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [isVerified]);

  const clearVerification = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setVerifiedEmail(null);
    setIsVerified(false);
  }, []);

  return {
    isVerified,
    verifiedEmail,
    showModal,
    setShowModal,
    verify,
    requireVerification,
    clearVerification,
  };
};
