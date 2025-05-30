import { useEffect, useState } from "react";
import Head from "next/head";
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
      <Head>
        <title>CompraCheck</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <img
          src="/logoheader.png"
          alt="CompraCheck Header Logo"
          style={{ height: "43px", maxWidth: "100%", marginBottom: "0.5rem" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          maxWidth: "clamp(100%, 90vw, 600px)",
          margin: "2rem auto",
          padding: "1rem",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo CompraCheck"
          style={{
            display: "block",
            margin: "0 auto 1rem",
            width: "100%",
            maxWidth: "300px",
          }}
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
            padding: "1rem",
            fontSize: "1rem",
            marginTop: "2rem",
            borderRadius: "12px",
            border: "1px solid #ccc",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            outline: "none",
            backgroundColor: "#fff",
            color: "#000",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleCheck}
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            width: "50%",
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#374151",
            border: "none",
            borderRadius: "9999px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "background-color 0.3s",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Checar!
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
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  width: "clamp(120px, 35vw, 160px)",
                  height: "clamp(120px, 35vw, 160px)",
                  backgroundColor: "#1f2937",
                  border: "3px solid #444",
                  borderRadius: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 0 15px rgba(255,255,255,0.1)",
                  animation: "pulse-glow 2s infinite ease-in-out",
                }}
              >
                <div
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    background:
                      result.score <= 40
                        ? `
                          radial-gradient(circle at center, rgba(255, 0, 0, 0.9) 0%, #7f1d1d 80%),
                          repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 2px, transparent 2px, transparent 4px)
                        `
                        : result.score < 70
                        ? `
                          radial-gradient(circle at center, rgba(255, 255, 0, 0.85) 0%, #92400e 80%),
                          repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.06) 0px, rgba(255, 255, 255, 0.06) 2px, transparent 2px, transparent 4px)
                        `
                        : `
                          radial-gradient(circle at center, rgba(34, 197, 94, 0.9) 0%, #064e3b 80%),
                          repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.06) 0px, rgba(255, 255, 255, 0.06) 2px, transparent 2px, transparent 4px)
                        `,
                    border:
                      result.score <= 40
                        ? "3px solid #4b0000"
                        : result.score < 70
                        ? "3px solid #92400e"
                        : "3px solid #064e3b",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    textAlign: "center",
                    boxShadow:
                      result.score <= 40
                        ? "0 0 30px rgba(255, 0, 0, 0.6)"
                        : result.score < 70
                        ? "0 0 30px rgba(255, 230, 0, 0.5)"
                        : "0 0 30px rgba(34, 197, 94, 0.5)",
                    animation: "pulse-glow 2s infinite ease-in-out",
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
              {(result.reason || []).map((r: string, i: number) => (
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

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
          }
        }
      `}</style>
    </>
  );
}
