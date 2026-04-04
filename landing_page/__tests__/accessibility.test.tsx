/**
 * Accessibility Tests
 *
 * Uses jest-axe to enforce WCAG compliance on UI components.
 * Run with: npm test
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

expect.extend(toHaveNoViolations);

describe('Accessibility (jest-axe)', () => {
  describe('Button', () => {
    it('should have no violations with text content', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with all variants', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Input', () => {
    it('should have no violations with a label', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="disabled-input">Disabled</Label>
          <Input id="disabled-input" disabled />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Alert', () => {
    it('should have no violations with role="alert"', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with destructive variant', async () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Critical Error</AlertTitle>
          <AlertDescription>Please try again later.</AlertDescription>
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Accordion', () => {
    it('should have no violations', async () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              You share a ChatGPT conversation link and we analyze it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is my data private?</AccordionTrigger>
            <AccordionContent>
              Yes, 100% private. We never share your raw conversations.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Dialog', () => {
    it('should have no violations when open', async () => {
      const { container } = render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Get Early Access</DialogTitle>
              <DialogDescription>Join the waitlist for early access.</DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="dialog-email">Email</Label>
              <Input id="dialog-email" type="email" placeholder="you@example.com" />
              <Button type="submit">Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form elements with ARIA', () => {
    it('should have no violations on error messages with role="alert"', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="test-email">Email</Label>
          <Input id="test-email" type="email" aria-invalid="true" aria-describedby="email-error" />
          <p id="email-error" role="alert" className="text-sm text-red-600">
            Invalid email address
          </p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations on checkbox groups', async () => {
      const { container } = render(
        <fieldset>
          <legend>Interests</legend>
          <label className="flex items-start min-h-[44px]">
            <input type="checkbox" name="interests" value="hiring" className="h-5 w-5" />
            <span>Hiring</span>
          </label>
          <label className="flex items-start min-h-[44px]">
            <input type="checkbox" name="interests" value="dating" className="h-5 w-5" />
            <span>Dating</span>
          </label>
        </fieldset>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations on radio groups', async () => {
      const { container } = render(
        <fieldset>
          <legend>AI History</legend>
          <label className="flex items-center min-h-[44px]">
            <input type="radio" name="ai_history" value="extensive" className="h-5 w-5" />
            <span>Extensive</span>
          </label>
          <label className="flex items-center min-h-[44px]">
            <input type="radio" name="ai_history" value="some" className="h-5 w-5" />
            <span>Some</span>
          </label>
        </fieldset>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Skip navigation', () => {
    it('should have no violations with skip link pattern', async () => {
      const { container } = render(
        <div>
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>
          <main id="main-content">
            <h1>Page content</h1>
          </main>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Loading states', () => {
    it('should have no violations on status indicators', async () => {
      const { container } = render(
        <div role="status" aria-live="polite">
          Loading analysis...
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
