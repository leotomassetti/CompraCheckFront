"use client";
import { useEffect, useState } from "react";

type ConsentOptions = {
  analytics: boolean;
  history: boolean;
  personalization: boolean;
};

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState<ConsentOptions>({
    analytics: true,
    history: true,
    personalization: true,
  });

  useEffect(() => {
    const cookieMatch = document.cookie.match(/cookiesAccepted=([^;]+)/);
    const stored = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    if (!stored) {
      setShow(true);
    }
  }, []);

  const updateConsent = (key: keyof ConsentOptions) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const acceptCookies = () => {
    document.cookie = `cookiesAccepted=${encodeURIComponent(
      JSON.stringify(consent)
    )}; path=/; max-age=31536000`; // 1 ano
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        width: "100%",
        backgroundColor: "#222",
        color: "#fff",
        padding: "1rem",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        fontSize: "0.9rem",
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}>
        Usamos cookies para melhorar sua experiência. Escolha o que deseja
        desabilitar:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          <input
            type="checkbox"
            checked={consent.analytics}
            onChange={() => updateConsent("analytics")}
          />{" "}
          Coleta de dados analíticos
        </label>
        <label>
          <input
            type="checkbox"
            checked={consent.history}
            onChange={() => updateConsent("history")}
          />{" "}
          Salvar histórico de sites verificados
        </label>
        <label>
          <input
            type="checkbox"
            checked={consent.personalization}
            onChange={() => updateConsent("personalization")}
          />{" "}
          Personalização de conteúdo
        </label>
      </div>

      <button
        onClick={acceptCookies}
        style={{
          marginTop: "0.75rem",
          padding: "0.4rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Aceitar seleção
      </button>
    </div>
  );
}
