import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export default function JoinAsVendor() {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleChoose = (plan: string) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  return (
    <>
      <section className="py-12 px-4 bg-gradient-to-br from-white to-[#f0f2f7] min-h-screen">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h3>
            <p className="text-gray-600 text-lg">Flexible options for every vendor. Unlock more value as you grow!</p>
          </div>
          <div className="flex justify-center max-w-3xl mx-auto">
            {/* Platinum Plan Only - Expanded */}
            <div className="rounded-2xl bg-white/95 shadow-2xl border-2 border-[#101c34] p-10 flex flex-col items-center glassmorphism w-full">
              <h4 className="text-3xl font-extrabold text-[#101c34] mb-4 tracking-wide">Platinum Vendor Membership</h4>
              <div className="text-4xl font-extrabold text-[#101c34] mb-6">₹50,000 <span className="text-lg font-medium text-gray-500">/ year</span></div>
              <ul className="text-gray-800 text-lg mb-8 space-y-3 text-left w-full max-w-2xl mx-auto">
                <li>✔ <b>Top-tier Vendor Listing</b> with premium placement and visibility across the platform</li>
                <li>✔ <b>Featured Listings</b> on homepage and category pages</li>
                <li>✔ <b>Display as Premium Vendor</b> with exclusive badge</li>
                <li>✔ <b>Social Media Highlights</b> (multiple posts per year on our channels)</li>
                <li>✔ <b>Direct Connections & High-Quality Leads</b> delivered to your inbox</li>
                <li>✔ <b>Invitations to Business Networking Events</b> and industry mixers</li>
                <li>✔ <b>Professional Tie-Up & Collaboration Assistance</b> with top hotels and event planners</li>
                <li>✔ <b>Access to Private Community Forum</b> for knowledge sharing and support</li>
                <li>✔ <b>Exclusive Access to Industry Events & Workshops</b></li>
                <li>✔ <b>Yearly Award Recognition / PR</b> with press release and digital certificate</li>
                <li>✔ <b>Dedicated Account Manager</b> for personalized support</li>
                <li>✔ <b>Priority Support</b> via phone, email, and chat</li>
                <li>✔ <b>Custom Marketing Campaigns</b> (on request, subject to approval)</li>
                <li>✔ <b>Early Access to New Features</b> and beta programs</li>
              </ul>
              <div className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
                <b>Platinum is our most comprehensive plan, designed for ambitious vendors who want maximum exposure, premium support, and exclusive opportunities in the hospitality industry. Join the elite network and unlock your business’s full potential!</b>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#101c34] to-[#0a1220] hover:bg-[#0a1220] text-white font-bold py-3 rounded-lg text-xl" onClick={() => handleChoose('Platinum')}>Apply for Platinum Membership</Button>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial Stripe */}
    <div className="w-full flex justify-center bg-gradient-to-r from-[#f0f2f7] to-[#f0f2f7] py-8 mt-12 overflow-hidden">
        <div className="relative w-full max-w-full overflow-x-hidden">
          <div className="flex items-stretch gap-8 animate-testimonial-marquee-card" style={{animation: 'testimonial-marquee-card 40s linear infinite'}}>
            {/* Card-style testimonials, repeat for seamless loop */}
            {[
              { text: "GHT helped us double our bookings in 3 months!", author: "The Royal Palace" },
              { text: "The vendor support team is fantastic and responsive.", author: "Elegant Events" },
              { text: "We love the exposure and leads from this platform.", author: "Dream Weddings" },
              { text: "A must for any serious hospitality business.", author: "Grand Banquets" },
              // Repeat for seamless loop
              { text: "GHT helped us double our bookings in 3 months!", author: "The Royal Palace" },
              { text: "The vendor support team is fantastic and responsive.", author: "Elegant Events" },
              { text: "We love the exposure and leads from this platform.", author: "Dream Weddings" },
              { text: "A must for any serious hospitality business.", author: "Grand Banquets" },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-[#d0d6e8] min-w-[340px] max-w-xs flex flex-col justify-between p-6 h-44">
                <div className="text-gray-700 text-base mb-4 line-clamp-3">“{t.text}”</div>
                <div className="text-[#101c34] font-bold text-right">– {t.author}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes testimonial-marquee-card {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Registration Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedPlan} Plan</DialogTitle>
            <DialogDescription>
              Fill out the form below to apply for the <b>{selectedPlan}</b> plan. Our team will contact you soon!
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2" placeholder="you@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" className="w-full border rounded px-3 py-2" placeholder="Phone Number" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Business / Brand Name" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#101c34] hover:bg-[#101c34] text-white">Submit Application</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
