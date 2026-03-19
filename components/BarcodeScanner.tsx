"use client";

import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({
  onScan,
}: {
  onScan: (code: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannedRef = useRef<boolean>(false);   // lock: fire only once
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    scannedRef.current = false;

    async function startScanner() {
      if (!videoRef.current) return;

      controlsRef.current = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          // Ignore errors (they fire constantly when no barcode is in view)
          if (!result) return;
          // Only fire once per mount
          if (scannedRef.current) return;
          scannedRef.current = true;

          const code = result.getText();

          // Stop camera immediately after successful scan
          if (controlsRef.current) {
            controlsRef.current.stop();
          }

          onScan(code);
        }
      );
    }

    startScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "10px",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
}
