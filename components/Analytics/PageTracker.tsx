"use client";

import { useEffect } from "react";

interface PageTrackerProps {
  pagePath: string;
  pageName: string;
}

/**
 * Component to track page visits
 * Add this to any page you want to track
 */
export function PageTracker({ pagePath, pageName }: PageTrackerProps) {
  useEffect(() => {
    // Generate or retrieve visitor ID from localStorage
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("visitor_id", visitorId);
    }

    // Track the visit
    fetch("/api/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pagePath,
        pageName,
        visitorId,
      }),
    }).catch((err) => {
      // Silently fail - don't break the page if tracking fails
      console.error("Failed to track visit:", err);
    });
  }, [pagePath, pageName]);

  // This component doesn't render anything
  return null;
}
