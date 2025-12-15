/**
 * Waitlist Form Component
 *
 * Modal/dialog form for waitlist signups.
 * Form fields from LANDING_PAGE_PLAN.md lines 299-335
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackEvent } from '@/lib/analytics/posthog';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  primary_interest: z.enum([
    'hiring_recruiter',
    'hiring_jobseeker',
    'dating',
    'cofounder',
    'mastermind',
    'other',
  ]),
  other_interest_detail: z.string().optional(),
  has_ai_history: z.enum(['extensive', 'some', 'willing', 'none']).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WaitlistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCategory?: string;
}

export function WaitlistForm({ open, onOpenChange, preselectedCategory }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_interest: preselectedCategory as any,
    },
  });

  // Track form open/close for abandonment funnel
  useEffect(() => {
    if (open && !submitted) {
      trackEvent('waitlist_form_opened', {
        preselected_category: preselectedCategory || 'none',
      });
    } else if (!open && !submitted) {
      trackEvent('waitlist_form_abandoned', {
        preselected_category: preselectedCategory || 'none',
      });
    }
  }, [open, submitted, preselectedCategory]);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join waitlist');
      }

      setPosition(result.position);
      setSubmitted(true);

      // Track successful form submission
      trackEvent('waitlist_form_submitted', {
        preselected_category: preselectedCategory || 'none',
        primary_interest: data.primary_interest,
        has_ai_history: data.has_ai_history || 'not_specified',
        waitlist_position: result.position,
      });
    } catch (err: any) {
      setError(err.message);

      // Track form submission error
      trackEvent('waitlist_form_error', {
        error_message: err.message,
        preselected_category: preselectedCategory || 'none',
      });
    }
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✓ You're on the list!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Thanks for joining. You're #{position} on the waitlist. We'll send you an invite as
              soon as we launch in Q1 2026.
            </p>
            <p className="text-sm text-gray-600">
              In the meantime, follow our journey:
              <br />
              <a href="#" className="text-brand-primary">Twitter</a> |{' '}
              <a href="#" className="text-brand-primary">LinkedIn</a>
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Get Early Access</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Primary Interest */}
          <div>
            <Label>{"I'm"} most interested in:</Label>
            <div className="space-y-3 mt-2">
              {[
                {
                  value: 'hiring_recruiter',
                  label: "Hiring - I'm recruiting candidates",
                  description: "Find candidates who can actually do the job, not just interview well"
                },
                {
                  value: 'hiring_jobseeker',
                  label: "Hiring - I'm seeking a job",
                  description: "Showcase your real capabilities and find roles that truly fit"
                },
                {
                  value: 'dating',
                  label: "Dating - I'm looking for a relationship",
                  description: "Match on authentic personality and communication style"
                },
                {
                  value: 'cofounder',
                  label: "Founding - I'm seeking a co-founder",
                  description: "Find a long-term business partner to start a company with"
                },
                {
                  value: 'mastermind',
                  label: "Mastermind - I'm joining a peer group",
                  description: "Join a peer support network for advice, feedback, and accountability"
                },
                {
                  value: 'other',
                  label: "Other - I'm interested in something else",
                  description: "Something else in mind? Let us know"
                },
              ].map((option) => (
                <label key={option.value} className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    {...register('primary_interest')}
                    value={option.value}
                    className="mr-3 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* AI History */}
          <div>
            <Label>(Optional) Have you used ChatGPT or Claude extensively?</Label>
            <div className="space-y-2 mt-2">
              {[
                { value: 'extensive', label: 'Yes, 50+ conversations or 6+ months of regular use' },
                { value: 'some', label: 'Some, maybe 10-50 conversations' },
                { value: 'willing', label: "No, but I'm willing to build up history" },
                { value: 'none', label: 'New to AI assistants' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    {...register('has_ai_history')}
                    value={option.value}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Joining...' : 'Get Early Access'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By joining, you'll get invite-only early access, updates on our launch progress, and
            the chance to shape the product.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
