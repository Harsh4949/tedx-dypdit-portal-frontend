// File: src/components/RegistrationForm/RegisterComponent.jsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import MemberDetails from "./MemberDetails";
import tedx_logo from '../../assets/tedx_logo.jpg';
import axios from "axios";

export default function RegisterComponent() {
  const [type, setType] = useState("solo");
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', college: '', department: '',
    members: [{}, {}, {}] // placeholders for duo/trio
  });

  const validateForm = () => {
    let errs = {};
    if (!formData.name) errs.name = "Name is required.";
    if (!formData.email) errs.email = "Email is required.";
    if (!formData.contact) errs.contact = "Contact is required.";
    if (!formData.college) errs.college = "College is required.";
    if (!formData.department) errs.department = "Department is required.";
    if (!screenshot) errs.screenshot = "Payment screenshot is required.";

    if (type !== 'solo') {
      const count = type === 'duo' ? 1 : 2;
      for (let i = 0; i <= count; i++) {
        const m = formData.members[i];
        if (!m.name || !m.email || !m.contact || !m.college || !m.department) {
          errs[`member-${i}`] = `All fields for Member ${i + 1} are required.`;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {

  if (!validateForm()) return;

  try {

    const dummyScreenshotURL = "https://via.placeholder.com/300"; 
    const dummyRefNo = "TXN" + Math.floor(100000000000 + Math.random() * 900000000000);


    const payload = {
      refNo: dummyRefNo,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      college: formData.college,
      department: formData.department,
      type: type,
      groupMembers: [],
      paymentScreenshotURL: dummyScreenshotURL,
      submittedAt: new Date(),
    };

    // 4. Add groupMembers if duo/trio

    if (type !== "solo") {
      const members = formData.members
        .slice(0, type === "duo" ? 1 : 2)
        .map((member) => ({
          ...member,
        }));
      payload.groupMembers.push(...members);
    }

    // 5. POST to API
    const res = await axios.post("http://localhost:3000/queue-submitted-forms", payload);
    if (res.status === 201 || res.status === 200) {
      alert("Form submitted successfully");
    } else {
      alert("Failed to submit form.");
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Error submitting form.");
  }
};

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleMemberChange = (index, key, value) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, members: updated });
  };

  const memberCount = type === "duo" ? 1 : type === "trio" ? 2 : 0;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <img src={tedx_logo} alt="TEDx Logo" className="h-10" />
        <Button variant="ghost" className="text-white border border-white hover:bg-white hover:text-black">
          <ShieldCheck className="mr-2" /> Admin
        </Button>
      </div>

      <Card className="bg-[#121212] text-white max-w-4xl mx-auto w-full">
        <CardContent className="p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className="grid gap-6"
          >
            <Input placeholder="Full Name" className=" text-black text-4xl font-bold bg-white/90 mt-5" onChange={e => handleChange('name', e.target.value)} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <Input type="email" placeholder="Email" className=" text-black text-4xl font-bold bg-white/90" onChange={e => handleChange('email', e.target.value)} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <Input type="tel" placeholder="Contact Number" className=" text-black text-4xl font-bold bg-white/90" onChange={e => handleChange('contact', e.target.value)} />
            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

            <Input placeholder="College Name" className="bg-white/90  text-black text-4xl font-bold" onChange={e => handleChange('college', e.target.value)} />
            {errors.college && <p className="text-red-500 text-sm">{errors.college}</p>}

            <Input placeholder="Department" className="bg-white/90 text-black text-4xl font-bold" onChange={e => handleChange('department', e.target.value)} />
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}

            <Select onValueChange={setType} defaultValue="solo">
              <SelectTrigger className="bg-white/90 text-black">
                <SelectValue placeholder="Participation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo" className="bg-white/90 text-black">Solo</SelectItem>
                <SelectItem value="duo" className="bg-white/90 text-black">Duo</SelectItem>
                <SelectItem value="trio" className="bg-white/90 text-black">Trio</SelectItem>
              </SelectContent>
            </Select>

            {[...Array(memberCount)].map((_, i) => (
              <MemberDetails 
                key={i} 
                id={i + 1} 
                onChange={(key, value) => handleMemberChange(i, key, value)} 
                error={errors[`member-${i}`]} 
              />
            ))}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold ">Upload Payment Screenshot</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
                className="bg-white/70  text-black text-4xl "
              />
              {errors.screenshot && <p className="text-red-500 text-sm ">{errors.screenshot}</p>}
              <p className="text-sm text-gray-400">Upload clear screenshot. <a href="#" className="underline text-blue-400">Learn how to upload</a></p>
            </div>

            <Button 
              onClick={handleRegister} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-auto"
            >
              Register
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}