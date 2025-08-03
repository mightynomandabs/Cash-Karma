import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      id: 1,
      question: "What is Cash Karma?",
      answer: "Cash Karma is a social giving club that gamifies generosity. We make it easy and fun to give small amounts to causes you care about, while building a community around collective impact."
    },
    {
      id: 2,
      question: "How does the matching system work?",
      answer: "Our AI-powered matching system connects your drops with recipients in real-time. When you send a drop, it's instantly matched with someone who needs it, creating immediate impact and transparency."
    },
    {
      id: 3,
      question: "Is my money safe and secure?",
      answer: "Absolutely. We use bank-grade encryption and trusted payment processors like Razorpay. All transactions are secure, transparent, and protected by industry-standard security measures."
    },
    {
      id: 4,
      question: "How do I earn badges and achievements?",
      answer: "Earn badges through consistent giving, not referrals. We celebrate your generosity journey with achievements for milestones like 'First Drop', 'Karma Pioneer', and 'Impact Legend'."
    },
    {
      id: 5,
      question: "Can I see where my money goes?",
      answer: "Yes! Every drop comes with full transparency. You'll see exactly who received your drop, the impact it created, and real-time updates on how your generosity is making a difference."
    },
    {
      id: 6,
      question: "What makes Cash Karma different?",
      answer: "Unlike traditional giving platforms, we focus on micro-amounts, real-time matching, and community building. We believe small acts of kindness, when amplified by technology, can create massive positive change."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-24 px-6 bg-surface-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-gray-50 via-surface-white to-surface-cream" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-gold/5 to-accent-purple/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent-purple/5 to-primary-gold/5 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-primary-gold" />
            <span className="text-sm font-semibold text-primary-gold">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            frequently asked questions
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            everything you need to know about cash karma and how we're revolutionizing giving
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={faq.id}
              className={`bg-surface-white border border-border/50 rounded-xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden ${
                openItems.includes(faq.id) ? 'ring-2 ring-primary-gold/30' : ''
              }`}
            >
              <CardHeader 
                className="p-6 cursor-pointer hover:bg-surface-gray-50/50 transition-colors duration-300"
                onClick={() => toggleItem(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItems.includes(faq.id) ? (
                      <Minus className="w-5 h-5 text-primary-gold transition-transform duration-300" />
                    ) : (
                      <Plus className="w-5 h-5 text-text-secondary transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {openItems.includes(faq.id) && (
                <CardContent className="px-6 pb-6">
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 border border-primary-gold/30 rounded-2xl p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Still have questions?
            </h3>
            <p className="text-text-secondary mb-6">
              Our support team is here to help you get started with your karma journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@cashkarma.app"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-gold text-text-primary rounded-full font-semibold transition-all duration-300 hover:bg-primary-gold-dark hover:scale-105 shadow-soft"
              >
                <span>Contact Support</span>
              </a>
              <a 
                href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-gold text-primary-gold rounded-full font-semibold transition-all duration-300 hover:bg-primary-gold hover:text-text-primary hover:scale-105"
              >
                <span>Help Center</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 