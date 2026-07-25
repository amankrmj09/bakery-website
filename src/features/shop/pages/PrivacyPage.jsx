import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-6">
      <div className="max-w-4xl w-full bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold text-foreground mb-6 text-center text-[#eab308]">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect various types of information in connection with the services we provide, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Information you provide directly to us, such as when you create an account, make a purchase, or contact us.</li>
              <li>Information collected automatically, such as IP addresses, browser types, and usage details through cookies and similar technologies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To provide, maintain, and improve our services.</li>
              <li>To process transactions and send related information.</li>
              <li>To send you technical notices, updates, security alerts, and support and administrative messages.</li>
              <li>To respond to your comments, questions, and requests and provide customer service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. Sharing of Your Information</h2>
            <p>We do not share your personal information with third parties except as necessary to provide our services (such as processing payments or delivering orders), comply with the law, or protect our rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no data transmission over the Internet can be guaranteed to be 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Your Choices</h2>
            <p>You may update, correct, or delete your account information at any time by logging into your account. You may also opt out of receiving promotional communications from us by following the instructions in those communications.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Changes to this Policy</h2>
            <p>We may update this privacy policy from time to time. If we make any material changes, we will notify you by posting the new privacy policy on this page.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
