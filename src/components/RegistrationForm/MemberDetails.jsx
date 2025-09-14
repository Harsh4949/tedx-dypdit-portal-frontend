// File: src/components/RegistrationForm/MemberDetails.jsx
import React from "react";
import { Input } from "@/components/ui/input";

export default function MemberDetails({ id, onChange, error }) {
  return (
    <div className="p-6 mb-6 border border-gray-700 rounded-2xl bg-[#000] shadow-md">
      <h3 className="text-lg font-semibold text-white mb-4">Member {id}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Full Name"
          className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:ring-0 focus:border-red-500"
          onChange={(e) => onChange("name", e.target.value)}
        />

        <Input
          type="email"
          placeholder="Email"
          className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:ring-0 focus:border-red-500"
          onChange={(e) => onChange("email", e.target.value)}
        />

        <Input
          type="tel"
          placeholder="Contact"
          className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:ring-0 focus:border-red-500"
          onChange={(e) => onChange("contact", e.target.value)}
        />

        <Input
          placeholder="College Name"
          className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:ring-0 focus:border-red-500"
          onChange={(e) => onChange("college", e.target.value)}
        />

        <Input
          placeholder="Department"
          className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:ring-0 focus:border-red-500 md:col-span-2"
          onChange={(e) => onChange("department", e.target.value)}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
