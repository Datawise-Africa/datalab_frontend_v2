import { useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { useSendOtp, useVerifyOtp } from '~/features/downloads';

interface StepVerificationProps {
  email: string;
  verified: boolean;
  onVerified: () => void;
}

export function StepVerification({
  email,
  verified,
  onVerified,
}: StepVerificationProps) {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleSendOtp = () => {
    sendOtp.mutate(email, {
      onSuccess: () => setOtpSent(true),
    });
  };

  const handleVerify = () => {
    verifyOtp.mutate(
      { email, code: otp },
      {
        onSuccess: (data) => {
          if (data.verified) onVerified();
        },
      }
    );
  };

  if (verified) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xl text-primary">&#10003;</span>
        </div>
        <p className="font-medium">Email verified</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We need to verify your email address before you can download this
        dataset.
      </p>

      <div className="space-y-2">
        <Label>Email</Label>
        <div className="flex gap-2">
          <Input value={email} disabled className="flex-1" />
          <Button
            variant="outline"
            onClick={handleSendOtp}
            disabled={sendOtp.isPending || otpSent}
          >
            {sendOtp.isPending
              ? 'Sending...'
              : otpSent
                ? 'OTP Sent'
                : 'Send OTP'}
          </Button>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <div className="flex gap-2">
            <Input
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="flex-1"
            />
            <Button
              onClick={handleVerify}
              disabled={otp.length < 6 || verifyOtp.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {verifyOtp.isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
          {verifyOtp.isError && (
            <p className="text-sm text-destructive">
              Invalid OTP. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
