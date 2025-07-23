// File: src/components/RegistrationForm/RegisterComponent.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, ShieldCheck } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import MemberDetails from "./MemberDetails";
import tedx_logo from '../../assets/tedxDYPDPU_logo.jpg';
import axios from "axios";
import Tesseract from 'tesseract.js';
import UploadGuideModal from './UploadGuideModal';
import service from "../../appwrite/config.js"; 
import api from '../../conf/api.js';
import{ qr_solo, qr_duo,qr_trio} from '../../assets/exportQR.js';
import AdminPortal from '../AdminPortal/AdminPortal.jsx';

export default function RegisterComponent() {
  const [showAdminPortal, setShowAdminPortal] = useState(false); // Toggle state
  const [type, setType] = useState("solo");
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [text, setText] = useState('');
  const [qrcode, setQrCode] = useState(qr_solo);
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', college: '', department: '',
    members: [{}, {}, {}] // placeholders for duo/trio
  });


    useEffect(() => {
      if (type === "solo") setQrCode(qr_solo);
      else if (type === "duo") setQrCode(qr_duo);
      else if (type === "trio") setQrCode(qr_trio);
    }, [type]);

  const validateForm = () => {
    let errs = {};

    // Validate main user
    if (!formData.name) errs.name = "Name is required.";
    if (!formData.email) errs.email = "Email is required.";
    if (!formData.contact) errs.contact = "Contact is required.";
    if (!formData.college) errs.college = "College is required.";
    if (!formData.department) errs.department = "Department is required.";
    if (!screenshot) errs.screenshot = "Payment screenshot is required.";

    if (type !== 'solo') {
      const extraMembersCount = type === 'duo' ? 1 : 2; // number of extra members

      for (let i = 0; i < extraMembersCount; i++) {
        const m = formData.members[i];
        if (!m || !m.name || !m.email || !m.contact || !m.college || !m.department) {
          errs[`member-${i}`] = `All fields for Member ${i + 2} are required.`; 
          // i+2 because main user is member 1, members array start at extra members from 2 onwards
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const handleRegister = async () => {
    if (!validateForm()) return;

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

   // payload groupMembers
      if (type !== "solo") {
        const extraMembersCount = type === 'duo' ? 1 : 2;

        for (let i = 0; i < extraMembersCount; i++) {
          const m = formData.members[i];
          if (m && m.name && m.email && m.contact && m.college && m.department) {
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

    // 5. POST to API
      //  const res = await axios.post("http://localhost:3000/queue-submitted-forms", payload);

      const res = await axios.post(api.apiUrl + "/queue-submitted-forms", payload);

      if (res.status === 201 || res.status === 200) {
        alert("Form submitted successfully");
        window.location.reload(); // Refresh the page
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

     if (showAdminPortal) return <AdminPortal onBack={() => setShowAdminPortal(false)} />;

    return (
      <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={tedx_logo} alt="TEDx Logo" className="h-10" />
          <Button
            variant="ghost"
            className="text-white border border-white hover:bg-white hover:text-black"
            onClick={() => setShowAdminPortal(true)} // Toggle Admin Portal
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
             <Select
                value={type || "solo"}
                onValueChange={setType}
              >
                <SelectTrigger className="bg-white/90 text-black text-lg font-medium">
                  <SelectValue placeholder="Participation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="solo">Solo</SelectItem>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="duo">Duo</SelectItem>
                  <SelectItem className="bg-white/90 text-black text-lg font-medium" value="trio">Trio</SelectItem>
                </SelectContent>
              </Select>

              {/* Extra Members (if duo/trio)*/}

              {[...Array(memberCount)].map((_, i) => (
                <MemberDetails
                  key={i}
                  id={i + 2} // member id to display (main user is 1)
                  onChange={(key, value) => handleMemberChange(i, key, value)} // pass index i (starting at 0)
                  error={errors[`member-${i}`]}
                />
              ))}


              {/* QR Code Section */}
                <div className="flex flex-col gap-2 mb-6">
                  <label className="text-sm font-semibold text-[#D4AF37]">Scan this QR Code</label>
                  <div className="flex justify-center">
                    <img src={qrcode} alt="QR Code" className="w-52 h-52 object-contain border-2 border-[#D4AF37] rounded-lg shadow-md" />
                  </div>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    Scan to complete the payment and verify your registration.
                  </p>
                </div>

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
               disabled={!type}
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