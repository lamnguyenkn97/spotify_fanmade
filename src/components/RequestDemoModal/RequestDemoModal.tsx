'use client';

import React, { useState } from 'react';
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
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setEmail('');
          setName('');
          setMessage('');
        }, 3000);
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
    if (!loading) {
      onClose();
      setEmail('');
      setName('');
      setMessage('');
      setError('');
      setSubmitted(false);
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
            <Typography variant="body" color="primary" className="text-center text-lg">
              ✅ Great news! You're already approved!
            </Typography>
            <Typography variant="body" color="secondary" className="text-center">
              Redirecting you to Spotify login...
            </Typography>
          </Stack>
        ) : submitted ? (
          <Stack direction="column" spacing="md" align="center" className="py-8">
            <Typography variant="body" color="primary" className="text-center text-lg">
              ✅ Thank you for your interest!
            </Typography>
            <Typography variant="body" color="secondary" className="text-center">
              I'll review your request and add you to the allowlist within 24 hours.
              You'll receive a confirmation email at <strong>{email}</strong>
            </Typography>
            <Typography variant="caption" color="secondary" className="text-center mt-4">
              Watch the demo video in the meantime!
            </Typography>
          </Stack>
        ) : (
          <>
            <Typography variant="body" color="secondary">
              Enter your Spotify account email to request access to the full authenticated experience. I'll add you to the allowlist and send you a confirmation within 24 hours.
            </Typography>

            <Input
              label="Spotify Email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onValueChange={setEmail}
              disabled={loading}
              fullWidth
            />

            <Input
              label="Name (Optional)"
              type="text"
              placeholder="Your name"
              value={name}
              onValueChange={setName}
              disabled={loading}
              fullWidth
            />

            <Stack direction="column" spacing="xs">
              <Typography variant="body" color="primary" weight="medium">
                Message (Optional)
              </Typography>
              <textarea
                placeholder="E.g., 'I'm a recruiter at Company X' or 'Frontend developer interested in your work'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 bg-grey-grey1 text-white rounded border border-grey-grey2 focus:border-spotify-green focus:outline-none resize-none"
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

