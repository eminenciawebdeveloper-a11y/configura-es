"use client";

import { useEffect, useRef, useState } from "react";

type Destino = { label: string; action: string };

const PRINCIPAL: Destino = {
  label: "Abrir Configurações",
  action: "android.settings.SETTINGS",
};

const ATALHOS: Destino[] = [
  { label: "Wi-Fi", action: "android.settings.WIFI_SETTINGS" },
  { label: "Bluetooth", action: "android.settings.BLUETOOTH_SETTINGS" },
  { label: "Localização", action: "android.settings.LOCATION_SOURCE_SETTINGS" },
  { label: "Dados móveis", action: "android.settings.DATA_ROAMING_SETTINGS" },
  { label: "Ecrã", action: "android.settings.DISPLAY_SETTINGS" },
  { label: "Som", action: "android.settings.SOUND_SETTINGS" },
  { label: "Bateria", action: "android.settings.BATTERY_SAVER_SETTINGS" },
  { label: "Aplicações", action: "android.settings.APPLICATION_SETTINGS" },
];

function montarIntent(action: string, fallbackUrl: string) {
  return (
    `intent:#Intent;action=${action};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
  );
}

export default function Home() {
  const [isAndroid, setIsAndroid] = useState<boolean | null>(null);
  const [falhou, setFalhou] = useState(false);
  const [alvo, setAlvo] = useState<string>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
    if (new URLSearchParams(window.location.search).get("falhou") === "1") {
      setFalhou(true);
    }

    // Se a página ficar escondida, as configurações abriram: cancela o aviso.
    const onHide = () => {
      if (document.visibilityState === "hidden" && timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  const abrir = (d: Destino) => {
    setFalhou(false);
    setAlvo(d.label);
    const fallback = `${window.location.origin}/?falhou=1`;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFalhou(true), 1800);
    window.location.href = montarIntent(d.action, fallback);
  };

  return (
    <main>
      <h1>⚙️ Configurações</h1>
      <p className="sub">Toca no botão para abrir as definições do teu telefone.</p>

      {isAndroid === false && (
        <div className="card warn">
          Este atalho só funciona em telefones <strong>Android</strong> com o
          Google Chrome (ou outro navegador baseado em Chromium).
        </div>
      )}

      <button className="btn-main" onClick={() => abrir(PRINCIPAL)}>
        {PRINCIPAL.label}
      </button>

      <h2>Atalhos diretos</h2>
      <div className="grid">
        {ATALHOS.map((a) => (
          <button key={a.action} className="btn-sec" onClick={() => abrir(a)}>
            {a.label}
          </button>
        ))}
      </div>

      {falhou && (
        <div className="card warn">
          <span className="tag">Não abriu</span>
          <div>
            O teu telemóvel ou navegador bloqueou o atalho
            {alvo ? ` (“${alvo}”)` : ""}. Abre manualmente:
          </div>
          <ol>
            <li>Sai do navegador (botão Início).</li>
            <li>Abre a app <strong>Configurações</strong> (ícone de engrenagem).</li>
            <li>Ou desliza do topo do ecrã e toca na engrenagem ⚙️.</li>
          </ol>
        </div>
      )}

      <div className="card info">
        <span className="tag">Nota</span>
        <div>
          Por segurança, alguns Androids e navegadores (Samsung Internet, Firefox,
          navegadores dentro de apps como Instagram ou WhatsApp) não permitem que
          sites abram o sistema. Para melhor resultado, abre este site no{" "}
          <strong>Google Chrome</strong>.
        </div>
      </div>
    </main>
  );
}
