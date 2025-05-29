import { useEffect, useState } from "react";
import CookieConsent from "../components/CookieConsent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const tips = [
    "Desconfie de preços muito abaixo do mercado.",
    "Prefira pagar com cartão de crédito ou intermediadores.",
    "Confira se há política de troca, privacidade e canais de contato.",
    "Desconfie de erros de português ou layout genérico.",
    "Nunca compartilhe seus dados pessoais via WhatsApp ou e-mail não verificados.",
    "Essa loja vende via marketplaces conhecidos (como Mercado Livre ou Amazon), considere comprar por lá.",
    "E é claro, sempre use o Compra Check!!!",
  ];

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#111" : "#fff";
    document.body.style.color = darkMode ? "#eee" : "#000";
  }, [darkMode]);

  const handleCheck = async () => {
    const consent = JSON.parse(localStorage.getItem("cookiesAccepted") || "{}");
    if (consent.history) {
      localStorage.setItem("lastChecked", inputUrl);
    }

    setLoading(true);
    setResult(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/check";
      const res = await fetch(`${apiUrl}?url=${encodeURIComponent(inputUrl)}`);
      const data = await res.json();
      setResult(data);
      console.log("🔎 Resultado da análise:", data);
    } catch (err) {
      console.error("Erro na verificação:", err);
      alert("Erro ao verificar o site.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <img
          src="/logoheader.png"
          alt="CompraCheck Header Logo"
          style={{ height: "43px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1rem" }}></span>
          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "45px",
              height: "22px",
              backgroundColor: darkMode ? "#4B5563" : "#FBBF24",
              borderRadius: "9999px",
              padding: "2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s ease",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#fff",
                borderRadius: "9999px",
                transition: "transform 0.3s ease",
                transform: darkMode ? "translateX(24px)" : "translateX(0px)",
              }}
            />
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "1rem",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo CompraCheck"
          style={{ display: "block", margin: "0 auto 1rem", width: "300px" }}
        />

        <p
          style={{ textAlign: "center", fontSize: "1.1rem", lineHeight: "1.6" }}
        >
          Antes de sair clicando e comprando por aí, dá uma olhada se o site é
          de confiança. Melhor prevenir do que cair em furada!
        </p>

        <div className="my-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="dicas">
              <AccordionTrigger>
                Dicas para comprar com segurança
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <ul className="list-disc ml-5 space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Cole o link aqui"
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            marginTop: "2rem",
          }}
        />
        <button
          onClick={handleCheck}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Check!
        </button>

        {loading && (
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                height: "4px",
                width: "100%",
                background:
                  "linear-gradient(90deg, #3b82f6 30%, #60a5fa 60%, #3b82f6 90%)",
                backgroundSize: "200% auto",
                animation: "loadingBar 1.5s linear infinite",
                borderRadius: "4px",
              }}
            />
            <p style={{ marginTop: "0.5rem" }}>Analisando...</p>
          </div>
        )}

        {result && (
          <div style={{ marginTop: "2rem" }}>
            <h1 style={{ textAlign: "center" }}>Resultado</h1>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  backgroundColor: "#1f2937",
                  borderRadius: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "3px solid #4b5563",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                  animation: "pulseGlow 2s infinite",
                }}
              >
                <div
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    backgroundColor:
                      result.score <= 40
                        ? "#dc2626"
                        : result.score < 70
                        ? "#facc15"
                        : "#16a34a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {result.score <= 40
                    ? "CUIDADO"
                    : result.score < 70
                    ? "SUSPEITO"
                    : "CONFIÁVEL"}
                </div>
              </div>
            </div>

            <ul style={{ marginTop: "1.5rem" }}>
              {result.cnpj && (
                <li>
                  <strong>CNPJ:</strong> {result.cnpj}
                </li>
              )}
              {result.empresa?.razaoSocial && (
                <>
                  <li>
                    <strong>Empresa:</strong> {result.empresa.razaoSocial}
                  </li>
                  <li>
                    <strong>Status:</strong> {result.empresa.status}
                  </li>
                  <li>
                    <strong>Abertura:</strong> {result.empresa.abertura}
                  </li>
                </>
              )}
              {result.reason.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            {result.socialLinks && result.socialLinks.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <ul>
                  <strong>Redes sociais encontradas</strong>
                  {result.socialLinks.map((link: string, i: number) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={{ height: "150px" }} />

        <footer
          style={{
            textAlign: "center",
            marginTop: "3rem",
            fontSize: "0.9rem",
            opacity: 0.6,
          }}
        >
          CompraCheck 2025. Todos os direitos reservados.
        </footer>
      </div>

      <CookieConsent />

      <style jsx global>{`
        @keyframes loadingBar {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
          }
          100% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
    </>
  );
}
