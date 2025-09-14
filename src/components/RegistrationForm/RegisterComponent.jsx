// File: src/components/RegistrationForm/RegisterComponent.jsx
import React, { useState, useEffect, use } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, ShieldCheck } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import MemberDetails from "./MemberDetails";
import axios from "axios";
import Tesseract from 'tesseract.js';
import UploadGuideModal from './UploadGuideModal';
import service from "../../appwrite/config.js"; 
import api from '../../conf/api.js';
import{ qr_solo, qr_duo,qr_trio} from '../../assets/exportQR.js';
import AdminPortal from '../AdminPortal/AdminPortal.jsx';
import Header from '../Header/Header.jsx';
import UPIPaymentModal from '../PaymentGateway/PaymentGateway.jsx';

import ConfirmationPage from '../ConfirmationPage/ConfirmationPage.jsx';
export default function RegisterComponent() {
  const [showAdminPortal, setShowAdminPortal] = useState(false); // Toggle state
  const [type, setType] = useState("solo");
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [text, setText] = useState('');
  const [totalCost, setTotalCost] = useState(249); // Default cost for solo
  const [qrcode, setQrCode] = useState(qr_solo);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', college: '', department: '',
    members: [{}, {}, {}] // placeholders for duo/trio
  });

  useEffect(() => {

    if (isPaymentDone) {
      handleRegister();
    }

  }, [isPaymentDone]);

  useEffect(() => {
    if (isFormSubmitted) {
      <ConfirmationPage />
    }
  }, [isFormSubmitted]);

    useEffect(() => {
      if (type === "solo") { setTotalCost(249); setQrCode(qr_solo); }
      else if (type === "duo") { setTotalCost(449); setQrCode(qr_duo); }
      else if (type === "trio") { setTotalCost(649); setQrCode(qr_trio); }
    }, [type]);

  const validateForm = () => {
    let errs = {};

    // Validate main user
    if (!formData.name) errs.name = "Name is required.";
    if (!formData.email) errs.email = "Email is required.";
    if (!formData.contact) errs.contact = "Contact is required.";
    if (!formData.college) errs.college = "College is required.";
    if (!formData.department) errs.department = "Department is required.";

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

    return (Object.keys(errs).length) === 0;
  };


const handleRegister = async () => {
    // if (!validateForm()) return;

    try {

      // 1. Upload image to Appwrite
      const uploaded = await service.uploadFile(screenshot);
      // if (!uploaded || !uploaded.$id) {
      //   alert("Image upload failed.");
      //   return;
      // }


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
       const res = await axios.post("http://localhost:3000/queue-submitted-forms", payload);

      // const res = await axios.post(api.apiUrl + "/queue-submitted-forms", payload);

      if (res.status === 201 || res.status === 200) {
        console.log("Form submitted successfully");
        setFormSubmitted(true);
        // window.location.reload(); // Refresh the page
      } else {
        console.log("Failed to submit form.");
      }
      
  } catch (error) {
    console.error("Submit error:", error);
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

     if (showAdminPortal) return <AdminPortal onBack={() => setShowAdminPortal(false)} />;

    return (
  <div className="min-h-screen bg-black text-white ">
    {/* Header */}
      <Header />
 

    {/* Form Container */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto w-full"
    >
      <Card className="bg-black border-none shadow-none rounded-none">
        <CardContent className="p-6 md:p-10 grid gap-8">
          {/* Title */}
          <h1 className="text-4xl font-bold">
            Grab Your <span className="text-red-500">Spot</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Ideas, inspiration, and impact — all in one place. Grab your ticket and step into a world where minds meet and stories spark change.
          </p>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                placeholder="Your name"
                className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:border-red-500 focus:ring-0"
                onChange={e => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Your contact"
                className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:border-red-500 focus:ring-0"
                onChange={e => handleChange('contact', e.target.value)}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Your email"
                className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:border-red-500 focus:ring-0"
                onChange={e => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Input
                placeholder="College "
                className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:border-red-500 focus:ring-0"
                onChange={e => handleChange('college', e.target.value)}
              />
              {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
            </div>

            <div className="md:col-span-2">
              <Input
                placeholder="Department"
                className="bg-transparent border-b border-gray-600 rounded-none text-white placeholder-gray-400 focus:border-red-500 focus:ring-0"
                onChange={e => handleChange('department', e.target.value)}
              />
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Select Type */}
          <Select value={type || "solo"} onValueChange={setType}>
            <SelectTrigger className="bg-transparent border-b border-gray-600 rounded-none text-white focus:border-red-500 focus:ring-0">
              <SelectValue placeholder="Participation Type" />
            </SelectTrigger>
            <SelectContent className="bg-black border border-gray-600 text-white">
              <SelectItem value="solo" className="border-b border-gray-700">Solo</SelectItem>
              <SelectItem value="duo" className="border-b border-gray-700">Duo</SelectItem>
              <SelectItem value="trio">Trio</SelectItem>
            </SelectContent>
          </Select>

          {/* Extra Members */}
          {[...Array(memberCount)].map((_, i) => (
            <MemberDetails
              key={i}
              id={i + 2}
              onChange={(key, value) => handleMemberChange(i, key, value)}
              error={errors[`member-${i}`]}
            />
          ))}

          {/* Price */}
          <div className="items-center">
            <p className=" font-bold animate-blink text-xl">
              <span className="text-red-500 ">Early</span> Bird Offer
            </p>
            <p className="text-sm font-semibold mt-2">
              Total Ticket Price : <span className="text-white">{totalCost} INR</span>
            </p>
        </div>

          {/* Make Payment Button */}
          <Button
            disabled={!type}
            onClick={() => { if (validateForm()) setShowPaymentModal(true); }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md self-start"
          >
            Make Payment
          </Button>
           {/* Show Payment Modal */}
            {showPaymentModal && (
              <UPIPaymentModal
                onClose={() => setShowPaymentModal(false)}
                qrcode={qrcode}
                totalCost={totalCost}
                isPaymentDone={false}
                setIsPaymentDone={setIsPaymentDone}
                setScreenshot={setScreenshot}
                text={text}
                setText={setText}
                isFormSubmitted={isFormSubmitted}
              />
            )}

            {isFormSubmitted && <ConfirmationPage />}

        </CardContent>
      </Card>
    </motion.div>
  </div>
);


  }