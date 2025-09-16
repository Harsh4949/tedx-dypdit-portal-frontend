// File: src/components/UPIPaymentModal.jsx
import React, { use, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bhim from "../../assets/paymentMethod/bhim.svg"
import gpay from "../../assets/paymentMethod/googlepay.svg"
import paytm from "../../assets/paymentMethod/paytm.svg"
import phonepe from "../../assets/paymentMethod/phonepe.svg"
import Tesseract from 'tesseract.js';
import UploadGuideModal from "../RegistrationForm/UploadGuideModal";

export default function UPIPaymentModal({ onClose, qrcode, totalCost, setIsPaymentDone, setScreenshot, text, setText ,isFormSubmitted}) {

  const [transactionId, setTransactionId] = useState("");
  const [orderId, setOrderId] = useState(Math.floor(100000 + Math.random() * 900000));
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [screenshot, setScreenshotState] = useState(null);
  const [errors, setErrors] = useState({ screenshot: null });
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Reset errors when screenshot changes
    if (screenshot) {
      setErrors({ screenshot: null });
    }
  }, [screenshot]);

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


  useEffect(() => {
    if (timer === 30) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown); // cleanup on unmount
    }
  }, []); 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        
      {/* 🔹 Background Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white w-[380px] rounded-lg shadow-lg overflow-hidden z-10">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 items-center justify-between">
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">TEDxDYPDPU Payment</h2>
            <button onClick={onClose}>
                <X className="w-5 h-5" /> 
            </button>
            </div>
             {/* Transaction ID */}
            <div className="bg-[#1877f2] text-white text-[12px] font-semibold   py-0.5 px-2 inline-block ">
              Transaction ID: #{orderId}
            </div>
        </div>
    
      <div>
      </div>

        {/* Body */}
        {step === 1 ? (
          <div className="p-4 m-4 text-center border border-gray-300 ">
         
            {/* QR Code */}
            <div className="flex justify-center mb-3">
              <img
                src={qrcode}
                alt="QR Code"
                className="w-45 h-45 object-cover rounded-lg border border-gray-300"
              />
            </div>

            {/* UPI ID */}
            <div className="bg-gray-100 text-sm py-2 rounded mb-3 font-mono text-black">
                8149744900@apl
            </div>

            {/* Instructions */}
            <p className="text-gray-600 text-xs mb-4">
                Scan the QR code with any UPI app to make your payment. After payment, upload a screenshot or receipt and note the UPI Reference ID (e.g., 401422121258). And Validate it on the next screen to confirm and complete your payment.
                </p>


            {/* Payment logos */}
            <div className="flex justify-center gap-4 mb-4">
              <img src={gpay} alt="GPay" className="h-6" />
              <img src={phonepe} alt="PhonePe" className="h-6" />
              <img src={paytm} alt="Paytm" className="h-6" />
              <img src={bhim} alt="BHIM" className="h-6" />
            </div>

          
            {/* Footer */}
            <div className="flex items-center justify-between py-2 mt-[50px] shadow-black bg-white border-t">
                <p className="text-xl font-bold text-gray-900">₹ {totalCost}.00</p>
                {timer > 0 ? (
                    <Button
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded"
                    disabled
                    >
                    Waiting... (
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:
                    {String(timer % 60).padStart(2, "0")}
                    )
                    </Button>
                ) : (
                    <Button
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded"
                    onClick={() => setStep(2)}
                    >
                    Proceed to Next
                    </Button>
                )}
            </div>

          </div>
        ) : (
          <div className="p-4 m-3 text-center  border border-gray-300 ">
    
            {/* Input */}

         {/* Upload Screenshot */}
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-semibold text-[#000000] p-3 m-2">
                Upload Payment Screenshot
              </label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleScreenshotChange(e.target.files[0])}
                className="bg-white/80 text-black text-[16px] p-2 rounded border-2 border-gray-300  m-1"
              />

              <p className="text-sm text-gray-400 flex items-center gap-1">
                <UploadGuideModal />

              {errors.screenshot && (
                <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>
              )}
            </p>
          </div>

            {/* Transaction ID Output */}
            {text && (
              <div className="mt-4 p-3 ">
                <p className="text-xs text-black font-semibold">Detected 12-digit Transaction / UTR / Reference ID :</p>
                <p className="text-base bg-gray-100 border p-2 m-2 border-[#030303] rounded text-black font-bold">{text}</p>
              </div>
            )}

            {/* Info */}
            <p className="text-xs text-gray-500 my-4">
              Please ensure that the payment has been deducted from your account before
              clicking <strong>Confirm</strong>.
            </p>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="px-6 py-2 rounded text-black border border-black"
                onClick={() => (setStep(1), setText('') , setScreenshot(null), setErrors({ screenshot: null }), setIsPaymentDone(false) , setTransactionId(''))}
              >
                Back
              </Button>

              <Button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                disabled={!text && !transactionId } // Disable confirm until ref ID is present
                onClick={() => {
                  setTransactionId(text);
                  setIsPaymentDone(true);
                    onClose();
                }}
              >
                Confirm
              </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
