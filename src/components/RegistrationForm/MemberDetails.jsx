// File: src/components/RegistrationForm/MemberDetails.jsx
import React from "react";
import { Input } from "@/components/ui/input";

export default function MemberDetails({ id, onChange, error }) {
  return (
    <div className="grid gap-4 p-4 border rounded-xl bg-black/10">
      <h3 className="font-semibold text-white">Member {id}</h3>

      <Input placeholder="Full Name" className="bg-white/90  text-black text-4xl font-bold" 
      onChange={e => onChange('name', e.target.value)} />

      <Input type="email" placeholder="Email" className="bg-white/90  text-black text-4xl font-bold" 
      onChange={e => onChange('email', e.target.value)} />

      <Input type="tel" placeholder="Contact" className="bg-white/90  text-black text-4xl font-bold" 
      onChange={e => onChange('contact', e.target.value)} />
      
      <Input placeholder="College Name" className="bg-white/90  text-black text-4xl font-bold" 
      onChange={e => onChange('college', e.target.value)} />

      <Input placeholder="Department" className="bg-white/90  text-black text-4xl font-bold" 
      onChange={e => onChange('department', e.target.value)} />
      
      {error && <p className="text-red-500 text-sm text-black text-4xl font-bold">{error}</p>}
    </div>
  );
}