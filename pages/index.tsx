import { useEffect, useState } from "react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCookiePopup, setShowCookiePopup] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setShowCookiePopup(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookiePopup(false);
  };

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#111" : "#fff";
    document.body.style.color = darkMode ? "#eee" : "#000";
  }, [darkMode]);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/check";
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
          style={{ height: "100px" }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem" }}>🌙</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ width: "40px", height: "20px" }}
          />
        </label>
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

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Cole o link aqui"
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
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

        {loading && <p style={{ marginTop: "1rem" }}>🔄 Analisando...</p>}

        {result && (
          <div style={{ marginTop: "2rem" }}>
            <h2>Resultado</h2>
            <p>
              <strong>Status:</strong> {result.status}
            </p>
            <p>
              <strong>Score:</strong> {result.score}/100
            </p>
            <ul>
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
                <h3>🔗 Redes sociais encontradas</h3>
                <ul>
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

      {showCookiePopup && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
            backgroundColor: darkMode ? "#333" : "#f2f2f2",
            color: darkMode ? "#fff" : "#000",
            padding: "1rem",
            boxShadow: "0 -2px 6px rgba(0,0,0,0.2)",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>
            Usamos cookies para melhorar sua experiência. Ao continuar, você
            concorda com nossa política de cookies.
          </p>
          <button
            onClick={acceptCookies}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Aceitar
          </button>
        </div>
      )}
    </>
  );
}
