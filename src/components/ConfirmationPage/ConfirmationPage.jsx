import React from "react";
import logo from "../../assets/logo.png";
import Header from "../Header/Header";
const whatsappLink = "https://chat.whatsapp.com/IQhpgWo3LQ3HKMxkLcrtR8";

function ConfirmationPage() {
  return (
    <div className="fixed inset-0 bg-[#000] flex flex-col items-center justify-center w-screen h-screen">
      <div className="w-full h-full flex flex-col items-center justify-center px-6 py-8">
       

        {/* Confirmation */}
        <div className="flex flex-col items-center text-center max-w-3xl">
          <span className="text-6xl">✅</span>
          <h1 className="text-4xl font-bold text-white mt-4">Thank You...!</h1>
          <p className="text-gray-300 mt-6 text-lg">
            Thank you for registering — your ticket will be processed shortly!<br />
            We've sent a confirmation email with all the event details. Keep an eye on your inbox (and spam folder, just in case).
          </p>
        </div>

        {/* WhatsApp Community */}
        <div className="mt-10 text-center">
          <span className="text-green-400 font-semibold">
            Join our WhatsApp community:{" "}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-green-300"
            >
              {whatsappLink}
            </a>
          </span>
        </div>

        {/* Need Help */}
        <div className="mt-12 text-center">
          <span className="text-2xl text-white">☎️ Need Help?</span>
          <p className="text-gray-300 mt-4 text-sm">
            If you have any issues or didn’t receive the email, feel free to reach out to us at: <br />
            <a
              href="mailto:tedxdypu.techwork@gmail.com"
              className="text-blue-400 underline"
            >
              tedxdypu.techwork@gmail.com
            </a>
          </p>
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap justify-center gap-12 mt-8 text-gray-300 text-sm">
          <div>
            <span className="font-semibold text-white">Kaushik</span> &nbsp;–&nbsp; +91 93216 21486
          </div>
          <div>
            <span className="font-semibold text-white">Suyog</span> &nbsp;–&nbsp; +91 94218 27472
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
