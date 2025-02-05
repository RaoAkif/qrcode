"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion } from "framer-motion";
import Head from "next/head";

export default function QRApp() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [scannedResult, setScannedResult] = useState("");
  const [savedQRCodes, setSavedQRCodes] = useState<string[]>([]);

  useEffect(() => {
    const savedCodes = localStorage.getItem("qrCodes");
    if (savedCodes) {
      setSavedQRCodes(JSON.parse(savedCodes));
    }
  }, []);

  const generateQRCode = () => {
    if (text) {
      if (!savedQRCodes.includes(text)) {
        // Ensure only unique QR codes are saved
        const updatedQRCodes = [...savedQRCodes, text];
        setSavedQRCodes(updatedQRCodes);
        localStorage.setItem("qrCodes", JSON.stringify(updatedQRCodes));
      }
      setQrCode(text); // Generate QR code regardless of uniqueness
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false // verbose
    );
    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText);
        scanner.clear();
      },
      (error) => {
        console.error(`QR Code Scan Error: ${error}`);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <Head>
        <title>QR Code App</title>
      </Head>

      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        QR Code Generator & Scanner
      </motion.h1>

      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter text for QR Code"
        />
        <button
          onClick={generateQRCode}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Generate QR Code
        </button>

        {qrCode && (
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-32"> {/* Reduced display size */}
              <QRCodeCanvas
                value={qrCode}
                size={500} // High internal resolution
                level="H" // High error correction
                imageSettings={{
                  src: "/logo.png", // Logo path
                  height: 80, // Keep logo size high
                  width: 80,
                  excavate: true, // Ensures QR remains scannable
                }}
                style={{ width: "100%", height: "100%" }} // Scales down display
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto mt-6">
        <motion.button
          onClick={startScanner}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Scan QR Code
        </motion.button>
        <div id="qr-reader" className="mt-4"></div>
        {scannedResult && (
          <p className="mt-2 text-center">Scanned: {scannedResult}</p>
        )}
      </div>

      <div className="max-w-lg mx-auto mt-6">
        <h2 className="text-xl font-bold">Saved QR Codes</h2>
        <ul className="mt-2 space-y-2">
          {savedQRCodes.map((code, index) => (
            <li
              key={index}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {code}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
