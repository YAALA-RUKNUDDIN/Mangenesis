import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Send, Building2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">
          Contact & SIH Demo Request
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Request an operational briefing or schedule an evaluation walkthrough for MOIL mining engineers and SIH Grand Finale evaluators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 space-y-6">
          <h2 className="text-lg font-bold text-white font-mono">Operations Headquarters</h2>
          <div className="space-y-4 text-xs font-mono text-slate-300">
            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">MOIL Central Cluster Integration</strong>
                <p className="text-slate-400 mt-0.5">Nagpur - Bhandara - Balaghat Belt</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Direct Intelligence Liaison</strong>
                <p className="text-slate-400 mt-0.5">mangenesis.intelligence@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">SIH26009 Nodal Evaluation Center</strong>
                <p className="text-slate-400 mt-0.5">Ministry of Steel / AICTE SIH Grand Finale</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">Demo Request Registered</h3>
              <p className="text-xs text-slate-400">
                Our technical team has logged your operational inquiry. We will contact you with session credentials.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 text-xs bg-[#121824] border border-[#243046] rounded-[8px] text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Role</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. MOIL Mining Operations / SIH Evaluator"
                  className="w-full px-3 py-2 text-xs bg-[#121824] border border-[#243046] rounded-[8px] text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Official Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@moil.nic.in"
                  className="w-full px-3 py-2 text-xs bg-[#121824] border border-[#243046] rounded-[8px] text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Mine or Focus Area</label>
                <select className="w-full px-3 py-2 text-xs bg-[#121824] border border-[#243046] rounded-[8px] text-white focus:outline-none focus:border-amber-500 font-mono">
                  <option className="bg-[#0D111A] text-slate-100 py-1.5">Gumgaon Underground & Opencast Mine</option>
                  <option className="bg-[#0D111A] text-slate-100 py-1.5">Balaghat Deep Underground Mine</option>
                  <option className="bg-[#0D111A] text-slate-100 py-1.5">Chikla Manganese Mine</option>
                  <option className="bg-[#0D111A] text-slate-100 py-1.5">Dongri Buzurg Mine</option>
                  <option className="bg-[#0D111A] text-slate-100 py-1.5">Multi-Mine Strategic Deployment</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full" iconRight={Send}>
                Request Operational Briefing
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
