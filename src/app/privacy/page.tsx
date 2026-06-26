export default function PrivacyPage() {
 return (
   <div className="max-w-3xl mx-auto px-4 py-12">
     <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
     <div className="space-y-6 text-muted-foreground">
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
         <p>We collect the following information to provide our services:</p>
         <ul className="list-disc pl-6 mt-2 space-y-1">
           <li>Birth information (date, time, location) — used for astrological chart calculations</li>
           <li>Email address — for weekly horoscope subscriptions</li>
           <li>Google login information (name, avatar) — for account management</li>
           <li>Browsing behavior data — collected via Google Analytics to improve our service</li>
         </ul>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
         <p>Your information is used solely for: providing astrological readings, sending subscription emails, and improving user experience. We do not use your personal data to train AI models.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
         <p>Your data is stored on secure servers. We use industry-standard security measures to protect your personal information. Birth data is considered sensitive and receives additional encryption protection.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Sharing</h2>
         <p>We share necessary data only with the following service providers: Google Analytics (anonymized browsing data), Google OAuth (login verification). We do not sell your personal information.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
         <p>You have the right to: access, correct, and delete your personal data; export your data; unsubscribe from email notifications. To exercise these rights, please contact us through the contact link at the bottom of our website.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookie Policy</h2>
         <p>This website uses Google Analytics cookies to analyze traffic. You can choose to accept or decline cookies through our cookie consent popup on your first visit.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
         <p>If you have any questions about this Privacy Policy, please reach out via the contact link in the website footer.</p>
       </section>
       <p className="text-sm mt-8">Last updated: June 24, 2026</p>
     </div>
   </div>
 );
}
