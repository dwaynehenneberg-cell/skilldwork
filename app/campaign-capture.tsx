"use client";

import { useEffect } from "react";
import { captureCampaign } from "./campaign";

export default function CampaignCapture() {
  useEffect(() => {
    captureCampaign();
  }, []);

  return null;
}
