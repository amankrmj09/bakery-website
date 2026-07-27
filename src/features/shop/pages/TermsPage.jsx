import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-6">
      <div className="max-w-4xl w-full bg-card border border-border rounded-3xl p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold text-foreground mb-6 text-center text-[#eab308]">Terms and Conditions</h1>
        
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Introduction</h2>
            <p>Welcome to Blu's Bakery! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Blu's Bakery if you do not agree to all of the terms and conditions stated on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. Intellectual Property Rights</h2>
            <p>Unless otherwise stated, Blu's Bakery and/or its licensors own the intellectual property rights for all material on Blu's Bakery. All intellectual property rights are reserved. You may access this from Blu's Bakery for your own personal use subjected to restrictions set in these terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. Orders and Payments</h2>
            <p>All orders placed through our website are subject to product availability and acceptance by Blu's Bakery. We reserve the right to refuse or cancel any order for any reason. Prices for our products are subject to change without notice. We are not responsible for pricing, typographical, or other errors in any offer by us and reserve the right to cancel any orders arising from such errors.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. User Account</h2>
            <p>If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Delivery and Fulfillment</h2>
            <p>Delivery times are estimates and not guarantees. We are not liable for any delays in delivery beyond our control. You are responsible for ensuring that the delivery address provided is correct and accessible.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Modifications</h2>
            <p>We reserve the right to revise these terms and conditions at any time without prior notice. By using this website, you are agreeing to be bound by the current version of these terms and conditions.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
