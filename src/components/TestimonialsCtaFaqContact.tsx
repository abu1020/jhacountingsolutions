import React from 'react';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { FaqAccordion } from './FaqAccordion';
import { FinalCtaBanner } from './FinalCtaBanner';
import { ContactFormAndOffices } from './ContactFormAndOffices';

interface TestimonialsCtaFaqContactProps {
  onOpenBookingModal: (service?: string) => void;
}

export const TestimonialsCtaFaqContact: React.FC<TestimonialsCtaFaqContactProps> = ({
  onOpenBookingModal
}) => {
  return (
    <>
      {/* Testimonials Carousel Section */}
      <TestimonialsCarousel />

      {/* FAQ Accordion Section */}
      <FaqAccordion />

      {/* Final CTA Banner */}
      <FinalCtaBanner onOpenBookingModal={onOpenBookingModal} />

      {/* Contact Form & 4 Office Locations */}
      <ContactFormAndOffices onOpenBookingModal={onOpenBookingModal} />
    </>
  );
};
