import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I create a campaign?",
      answer: "After registering as a student, complete the onboarding wizard and then navigate to your dashboard to create your first campaign."
    },
    {
      question: "How are donations processed?",
      answer: "All donations are processed securely and go directly to support the student's educational needs. You'll receive a receipt for tax purposes."
    },
    {
      question: "What verification is required?",
      answer: "Students must verify their enrollment status and educational goals through our verification process to ensure transparency."
    },
    {
      question: "Can I donate anonymously?",
      answer: "Yes, you can choose to donate anonymously. Your information will not be shared with the student."
    },
    {
      question: "How do I track my donations?",
      answer: "Visit your donor wallet to see all your donations, receipts, and updates from students you've supported."
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Find answers to common questions
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {filteredFaqs.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No results found. Try a different search term.
          </p>
        )}
      </Card>

      <Card className="mt-8 p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
        <p className="text-muted-foreground mb-4">
          Contact our support team for personalized assistance
        </p>
        <a href="mailto:support@edvisingU.com" className="text-primary hover:underline">
          support@edvisingU.com
        </a>
      </Card>
    </div>
  );
};

export default Help;
