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
import Tesseract from 'tesseract.js';
import UploadGuideModal from './UploadGuideModal';
import service from "../../appwrite/config.js"; 
import conf from '../../conf/conf.js';

export default function RegisterComponent() {

  const [type, setType] = useState("solo");
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [text, setText] = useState('');
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

  console.log("Form Data:", formData);
  try {

     // 1. Upload image to Appwrite
    const uploaded = await service.uploadFile(screenshot);
    if (!uploaded || !uploaded.$id) {
      alert("Image upload failed.");
      return;
    }


    const uploadedURL = service.getFilePreview(uploaded.$id); // <-- use your method

    const refNo = text;

    const payload = {
      refNo: refNo,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      college: formData.college,
      department: formData.department,
      type: type,
      groupMembers: [],
      paymentScreenshotURL: String(uploadedURL),
      submittedAt: new Date(),
    };

    // 4. Add groupMembers if duo/trio

    if (type !== "solo") {
      const count = type === 'duo' ? 1 : 2;

      for (let i = 0; i <= count; i++) {

        const m = formData.members[i];
        if (m.name && m.email && m.contact && m.college && m.department) {

          payload.groupMembers.push({
            name: m.name,
            email: m.email,
            contact: m.contact,
            college: m.college,
            department: m.department,
          });
        }
      }

    }

    console.log("Payload:", payload);
    // 5. POST to API
     const res = await axios.post("http://localhost:3000/queue-submitted-forms", payload);

      // const res = await axios.post(conf.apiUrl + "/queue-submitted-forms", payload);
      
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

 

  const handleScreenshotChange = async (file) => {
  
    if (file && file.size > 2 * 1024 * 1024) {
    setErrors({ ...errors, screenshot: "File size must be less than 2MB." });
    return;
  } else {
    setScreenshot(file);
    setErrors({ ...errors, screenshot: null });
  }

  try {
    const result = await Tesseract.recognize(
      file,
      'eng',
    );

    const ocrText = result.data.text;
    console.log("OCR Result:", ocrText);

    // Match 12-digit number
    const match = ocrText.match(/(?:\s|^)([0-9]{12})(?:\s|$)/);

    if (match) {
      setText(match[0]); // Only set the 12-digit reference number
    } else {
      setText('');
      setErrors({ ...errors, screenshot: "No valid 12-digit reference number found." });
    }
  } catch (error) {
    console.error("OCR Error:", error);
    setText('');
    setErrors({ ...errors, screenshot: "Error occurred while scanning." });
  }
  };


  const memberCount = type === "duo" ? 1 : type === "trio" ? 2 : 0;

    return (
      <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={tedx_logo} alt="TEDx Logo" className="h-10" />
          <Button
            variant="ghost"
            className="text-white border border-white hover:bg-white hover:text-black"
          >
            <ShieldCheck className="mr-2" /> Admin
          </Button>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto w-full"
        >
          <Card className="bg-[#121212] border border-[#D4AF37]/30 shadow-[0_0_20px_#d4af3740] rounded-lg overflow-hidden">
            <CardContent className="p-8 grid gap-6">
              <h1 className="text-3xl font-bold text-[#D4AF37] mb-4 mt-5 tracking-tight">
                Every Scar Has a Story
              </h1>

              {/* Form Fields */}
              <Input
                placeholder="Full Name"
                className="bg-white/90 text-black text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                onChange={e => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <Input
                type="email"
                placeholder="Email"
                className="bg-white/90 text-black text-lg font-medium"
                onChange={e => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <Input
                type="tel"
                placeholder="Contact Number"
                className="bg-white/90 text-black text-lg font-medium"
                onChange={e => handleChange('contact', e.target.value)}
              />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

              <Input
                placeholder="College Name"
                className="bg-white/90 text-black text-lg font-medium"
                onChange={e => handleChange('college', e.target.value)}
              />
              {errors.college && <p className="text-red-500 text-sm">{errors.college}</p>}

              <Input
                placeholder="Department"
                className="bg-white/90 text-black text-lg font-medium"
                onChange={e => handleChange('department', e.target.value)}
              />
              {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}

              {/* Select Type */}
              <Select onValueChange={setType} defaultValue="solo">
                <SelectTrigger className="bg-white/90 text-black text-lg font-medium">
                  <SelectValue placeholder="Participation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="solo">Solo</SelectItem>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="duo">Duo</SelectItem>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="trio">Trio</SelectItem>
                </SelectContent>
              </Select>

              {/* Extra Members (if duo/trio) */}
              {[...Array(memberCount)].map((_, i) => (
                <MemberDetails
                  key={i}
                  id={i}
                  onChange={(key, value) => handleMemberChange(i, key, value)}
                  error={errors[`member-${i+1}`]}
                />
              ))}

              {/* Upload Screenshot */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#D4AF37]">
                  Upload Payment Screenshot
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScreenshotChange(e.target.files[0])}
                  className="bg-white/80 text-black text-lg font-medium"
                />
                {errors.screenshot && <p className="text-red-500 text-sm">{errors.screenshot}</p>}
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  Upload clear screenshot. <UploadGuideModal />
                </p>
              </div>

              {/* Register Button */}
              <Button
                onClick={handleRegister}
                className="bg-gradient-to-r from-[#E62B1E] to-[#D4AF37] hover:opacity-90 transition text-white font-bold text-lg w-full sm:w-auto"
              >
                Register
              </Button>

              {/* Transaction ID Output */}
              {text && (
                <div className="mt-4 p-4 bg-[#1c1c1c] border-l-4 border-[#D4AF37] rounded shadow">
                  <p className="text-sm text-gray-400">Transaction ID (Ref No.):</p>
                  <p className="text-lg font-semibold text-white">{text}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );

  }