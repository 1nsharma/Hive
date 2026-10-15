import React from "react";

export default function Ticker() {
  const tickerItems = [
    { type: "SCAN", id: "IND-PET-10293", location: "Bandra West, Mumbai", time: "2 min ago", icon: "🔍" },
    { type: "REUNITED", id: "IND-PET-11842", location: "Jaipur", time: "home in 9 hrs 🐾", icon: "🏡" },
    { type: "TAG ACTIVATED", id: "IND-PET-30417", location: "Pune", time: "just now", icon: "🏷️" },
    { type: "SIGHTING", id: "IND-PET-20881", location: "Powai Lake", time: "photo verified", icon: "📍" },
    { type: "REMINDER", id: "DHPPi booster due", location: "IND-PET-10293", time: "upcoming", icon: "💉" },
    { type: "REUNITED", id: "IND-PET-14560", location: "Indiranagar, Bengaluru", time: "6 hrs ago", icon: "🐾" },
    { type: "SCAN", id: "IND-PET-22019", location: "Sector 21, Gurugram", time: "1 hr ago", icon: "🔍" },
    { type: "SOS CLOSED", id: "IND-PET-18733", location: "case resolved ✓", time: "today", icon: "✅" },
  ];

  // Double the list for seamless marquee loop
  const doubleItems = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker" aria-hidden="true" id="top">
      <div className="ticker-track">
        {doubleItems.map((item, idx) => (
          <span key={idx}>
            <b>{item.type}</b> · {item.id} · {item.location} <i>· {item.time}</i>
          </span>
        ))}
      </div>
    </div>
  );
}
