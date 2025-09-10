
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What are your shipping options?',
    answer: 'We offer standard and express shipping options. Standard shipping usually takes 5-7 business days, while express shipping takes 2-3 business days. Shipping costs are calculated at checkout based on your location and the selected shipping method.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order has been shipped, you will receive an email with a tracking number and a link to the carrier\'s website. You can use this information to track the status of your delivery.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We have a 15-day return policy. If you are not satisfied with your purchase, you can return it within 15 days of receiving your order for a full refund or exchange. The item must be unused, in its original packaging, and in the same condition that you received it.',
  },
  {
    question: 'How do I initiate a return?',
    answer: 'To initiate a return, please contact our customer support team with your order number and the reason for the return. We will provide you with instructions on how to proceed.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within India. We are working on expanding our shipping services to other countries in the future.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, as well as UPI, and other popular online payment methods. Our checkout process is secure and encrypted.',
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 md:py-20 container">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-bold">Frequently Asked Questions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Have questions? We have answers.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
