'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Stack, Typography, Input, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isAlreadyApproved, setIsAlreadyApproved] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [activeField, setActiveField] = useState<'email' | 'name' | 'message' | null>(null);

  // Restore focus after re-render (only for Input components, not textarea)
  useEffect(() => {
    if (!isOpen || loading || submitted || isAlreadyApproved) return;
    if (activeField === 'message') return; // Don't interfere with textarea
    
    const timer = setTimeout(() => {
      if (activeField === 'email') {
        emailInputRef.current?.focus();
      } else if (activeField === 'name') {
        nameInputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [email, name, isOpen, loading, submitted, isAlreadyApproved, activeField]);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, check if user is already approved
      const checkResponse = await fetch('/api/check-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const { approved } = await checkResponse.json();

      if (approved) {
        // User is already approved! Redirect to OAuth login
        setIsAlreadyApproved(true);
        setTimeout(() => {
          window.location.href = '/api/auth/login';
        }, 2000);
        return;
      }

      // User not approved yet, submit request
      const response = await fetch('/api/request-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, message }),
      });

      if (response.ok) {
        setSubmitted(true);
        // Don't auto-close - let user close manually
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !submitted) {
      onClose();
      setEmail('');
      setName('');
      setMessage('');
      setError('');
      setSubmitted(false);
      setIsAlreadyApproved(false);
      setActiveField(null);
    } else if (submitted || isAlreadyApproved) {
      // Allow closing confirmation screens
      onClose();
      setEmail('');
      setName('');
      setMessage('');
      setError('');
      setSubmitted(false);
      setIsAlreadyApproved(false);
      setActiveField(null);
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={handleClose} 
      title={isAlreadyApproved ? 'Already Approved!' : submitted ? 'Request Submitted!' : 'Request Demo Access'}
      showCloseButton={true}
      closeOnBackdropClick={false}
      closeOnEscape={true}
    >
      <Stack direction="column" spacing="lg" className="p-6">
        {isAlreadyApproved ? (
          <Stack direction="column" spacing="md" align="center" className="py-8">
            <Typography variant="body" color="primary" className="text-center text-lg" weight="medium">
              Already Approved
            </Typography>
            <Typography variant="body" color="secondary" className="text-center">
              Redirecting to Spotify login...
            </Typography>
          </Stack>
        ) : submitted ? (
          <Stack direction="column" spacing="lg" align="center" className="py-8">
            <Stack direction="column" spacing="sm" align="center">
              <Typography variant="body" color="primary" className="text-center text-lg" weight="medium">
                Request Submitted
              </Typography>
              <Typography variant="body" color="secondary" className="text-center">
                You'll receive confirmation at <strong>{email}</strong> within 24 hours.
              </Typography>
            </Stack>
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Medium}
              onClick={handleClose}
            >
              Done
            </Button>
          </Stack>
        ) : (
          <>
            <Typography variant="body" color="secondary">
              Enter your Spotify account email to request access to the full authenticated experience. I'll add you to the allowlist and send you a confirmation within 24 hours.
            </Typography>

            <Input
              ref={emailInputRef}
              label="Spotify Email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onValueChange={setEmail}
              onFocus={() => setActiveField('email')}
              disabled={loading}
              fullWidth
            />

            <Input
              ref={nameInputRef}
              label="Name (Optional)"
              type="text"
              placeholder="Your name"
              value={name}
              onValueChange={setName}
              onFocus={() => setActiveField('name')}
              disabled={loading}
              fullWidth
            />

            <Stack direction="column" spacing="xs">
              <Typography variant="body" color="primary" weight="medium">
                Message (Optional)
              </Typography>
              <Input
                type="text"
                placeholder="E.g., 'I'm a recruiter at Company X' or 'Frontend developer interested in your work'"
                value={message}
                onValueChange={setMessage}
                onFocus={() => setActiveField('message')}
                onBlur={() => setActiveField(null)}
                disabled={loading}
                fullWidth
                className="h-20"
              />
            </Stack>

            {error && (
              <Typography variant="caption" color="primary" className="text-red-500">
                {error}
              </Typography>
            )}

            <Stack direction="row" spacing="sm" justify="end">
              <Button
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                onClick={handleSubmit}
                loading={loading}
                disabled={loading || !email}
              >
                Submit Request
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Modal>
  );
};

