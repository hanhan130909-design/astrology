export default function TermsPage() {
 return (
   <div className="max-w-3xl mx-auto px-4 py-12">
     <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
     <div className="space-y-6 text-muted-foreground">
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">1. Service Description</h2>
         <p>Starry Fate provides astronomy-based astrological reading services. All astrological content is for entertainment and reference purposes only and does not constitute fortune prediction or decision-making advice.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">2. User Responsibilities</h2>
         <p>Users should provide accurate birth information for correct chart calculations. Users must not misuse the service, engage in illegal activities, or infringe upon the rights of others.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">3. Disclaimer</h2>
         <p>Astrological readings are based on traditional astrological theories and astronomical calculations for reference and entertainment only. Starry Fate is not responsible for any direct or indirect losses resulting from reliance on the content of this service.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">4. Paid Services</h2>
         <p>Some services (AI interpretations, annual horoscope reports, master consultations) are paid PRO services. Purchases are non-refundable unless the service is unable to be provided.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">5. Terms Changes</h2>
         <p>We reserve the right to modify these terms at any time. Material changes will be notified via website announcement or email.</p>
       </section>
       <section>
         <h2 className="text-xl font-semibold text-foreground mb-3">6. Governing Law</h2>
         <p>These terms are governed by applicable international laws. In the event of a dispute, both parties shall seek to resolve it through friendly negotiation.</p>
       </section>
       <p className="text-sm mt-8">Last updated: June 24, 2026</p>
     </div>
   </div>
 );
}
