import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Stay Updated
        </h2>
        <p className="mt-3 text-muted-foreground">
          Get notified about new datasets, research reports, and platform
          updates.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Thanks for subscribing! You&apos;ll hear from us soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="mr-1.5 h-4 w-4" />
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
