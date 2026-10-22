"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Bluetooth,
  Info,
  LayoutGrid,
  MapPin,
  Settings,
  Signal,
  Smartphone,
  Sun,
  Volume2,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";

type Destino = { label: string; action: string; Icon: LucideIcon };

const PRINCIPAL: Destino = {
  label: "Abrir Configurações",
  action: "android.settings.SETTINGS",
  Icon: Settings,
};

const ATALHOS: Destino[] = [
  { label: "Wi-Fi", action: "android.settings.WIFI_SETTINGS", Icon: Wifi },
  { label: "Bluetooth", action: "android.settings.BLUETOOTH_SETTINGS", Icon: Bluetooth },
  { label: "Localização", action: "android.settings.LOCATION_SOURCE_SETTINGS", Icon: MapPin },
  { label: "Dados móveis", action: "android.settings.DATA_ROAMING_SETTINGS", Icon: Signal },
  { label: "Ecrã", action: "android.settings.DISPLAY_SETTINGS", Icon: Sun },
  { label: "Som", action: "android.settings.SOUND_SETTINGS", Icon: Volume2 },
  { label: "Bateria", action: "android.settings.BATTERY_SAVER_SETTINGS", Icon: BatteryCharging },
  { label: "Aplicações", action: "android.settings.APPLICATION_SETTINGS", Icon: LayoutGrid },
];

function montarIntent(action: string, fallbackUrl: string) {
  return (
    `intent:#Intent;action=${action};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
  );
}

export default function Home() {
  const [mostrarInstrucoes, setMostrarInstrucoes] = useState(true);
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

  useEffect(() => {
    if (!mostrarInstrucoes) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMostrarInstrucoes(false);
    };

    window.addEventListener("keydown", fecharComEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [mostrarInstrucoes]);

  const abrir = (d: Destino) => {
    setFalhou(false);
    setAlvo(d.label);
    const fallback = `${window.location.origin}/?falhou=1`;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFalhou(true), 1800);
    window.location.href = montarIntent(d.action, fallback);
  };

  return (
    <>
      <main className="shell" inert={mostrarInstrucoes}>
      <header className="header">
        <div className="badge">
          <Settings size={22} strokeWidth={2.2} />
        </div>
        <div>
          <h1>Configurações</h1>
          <p className="sub">Acesso rápido às definições do teu Android</p>
        </div>
      </header>

      {isAndroid === false && (
        <div className="alert alert-warn" role="alert">
          <Smartphone size={20} className="alert-icon" />
          <div>
            Este atalho só funciona em telefones <strong>Android</strong> com o
            Google Chrome (ou outro navegador baseado em Chromium).
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-icon">
          <Settings size={34} strokeWidth={1.8} />
        </div>
        <h2 className="hero-title">Definições do telefone</h2>
        <p className="hero-text">
          Toca no botão para abrir diretamente as configurações do sistema.
        </p>
        <button className="btn-main" onClick={() => abrir(PRINCIPAL)}>
          <PRINCIPAL.Icon size={20} strokeWidth={2.2} />
          <span>{PRINCIPAL.label}</span>
          <ArrowRight size={18} strokeWidth={2.4} className="btn-arrow" />
        </button>
      </section>

      {falhou && (
        <div className="alert alert-warn" role="alert">
          <AlertTriangle size={20} className="alert-icon" />
          <div>
            <strong>Não foi possível abrir{alvo ? ` “${alvo}”` : ""}.</strong>
            <p className="alert-text">
              O teu telemóvel ou navegador bloqueou o atalho. Abre manualmente:
            </p>
            <ol className="steps">
              <li>Sai do navegador (botão Início).</li>
              <li>
                Abre a app <strong>Configurações</strong> (ícone de engrenagem).
              </li>
              <li>Ou desliza do topo do ecrã e toca no ícone de engrenagem.</li>
            </ol>
          </div>
        </div>
      )}

      <h3 className="section-title">Atalhos diretos</h3>
      <div className="grid">
        {ATALHOS.map(({ label, action, Icon }) => (
          <button
            key={action}
            className="tile"
            onClick={() => abrir({ label, action, Icon })}
          >
            <span className="tile-icon">
              <Icon size={20} strokeWidth={2.1} />
            </span>
            <span className="tile-label">{label}</span>
          </button>
        ))}
      </div>

      <div className="alert alert-info">
        <Info size={20} className="alert-icon" />
        <div>
          Por segurança, alguns Androids e navegadores (Samsung Internet,
          Firefox e navegadores dentro de apps como Instagram ou WhatsApp) não
          permitem que sites abram o sistema. Para melhor resultado, usa o{" "}
          <strong>Google Chrome</strong>.
        </div>
      </div>
      </main>
      {mostrarInstrucoes && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setMostrarInstrucoes(false);
            }
          }}
        >
          <section
            aria-labelledby="instructions-title"
            aria-modal="true"
            className="instructions-modal"
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;

              const botoes = event.currentTarget.querySelectorAll<HTMLButtonElement>(
                "button:not([disabled])",
              );
              const primeiro = botoes[0];
              const ultimo = botoes[botoes.length - 1];

              if (event.shiftKey && document.activeElement === primeiro) {
                event.preventDefault();
                ultimo.focus();
              } else if (!event.shiftKey && document.activeElement === ultimo) {
                event.preventDefault();
                primeiro.focus();
              }
            }}
            role="dialog"
          >
            <button
              aria-label="Fechar instruções"
              className="modal-close"
              onClick={() => setMostrarInstrucoes(false)}
              type="button"
            >
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Info size={24} />
            </div>
            <h2 id="instructions-title">Antes de começar</h2>
            <p className="modal-description">
              Este site ajuda a abrir as definições do teu telefone Android.
              Para usá-lo:
            </p>
            <ol className="modal-steps">
              <li>
                Abre este site num telefone Android, de preferência no Google
                Chrome.
              </li>
              <li>
                Toca em <strong>Abrir Configurações</strong> ou escolhe uma das
                definições rápidas.
              </li>
              <li>
                Se o navegador pedir confirmação, permite a abertura das
                definições.
              </li>
            </ol>
            <p className="modal-note">
              Alguns navegadores bloqueiam esta ação. Se não funcionar, abre a
              aplicação Configurações diretamente no teu telefone.
            </p>
            <button
              autoFocus
              className="modal-button"
              onClick={() => setMostrarInstrucoes(false)}
              type="button"
            >
              Entendi, continuar
            </button>
          </section>
        </div>
      )}
    </>
  );
}