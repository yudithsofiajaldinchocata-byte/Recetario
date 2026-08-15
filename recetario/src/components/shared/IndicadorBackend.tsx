import React, { useState } from 'react';
import useBackendStatus from '../../hooks/useBackendStatus';
import { BACKEND_STATUS_TEXTS } from '../../constants/texts.js';
import { Server, Wifi, WifiOff, Loader2, RefreshCw, X } from 'lucide-react';
import './IndicadorBackend.css';

/**
 * Componente flotante de estado del servidor con 0% textos hardcodeados.
 * Consume todas las cadenas desde BACKEND_STATUS_TEXTS en src/constants/texts.js.
 */
export const IndicadorBackend: React.FC = () => {
  const { estado, mensaje, verificarEstado } = useBackendStatus(30);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);

  return (
    <>
      {/* Insignia Flotante Re-diseñada (Cero Hardcoding) */}
      <button
        className={`backend-badge-btn estado-${estado.toLowerCase()}`}
        onClick={() => setModalAbierto(true)}
        title={mensaje}
      >
        <span className="backend-badge-dot"></span>
        {estado === 'ONLINE' && <Wifi size={14} />}
        {estado === 'DESPERTANDO' && <Loader2 size={14} className="animate-spin" />}
        {estado === 'OFFLINE' && <WifiOff size={14} />}
        <span className="backend-badge-label">
          {estado === 'ONLINE' && BACKEND_STATUS_TEXTS.badgeOnline}
          {estado === 'DESPERTANDO' && BACKEND_STATUS_TEXTS.badgeWakingUp}
          {estado === 'OFFLINE' && BACKEND_STATUS_TEXTS.badgeOffline}
        </span>
      </button>

      {/* Modal Informativo Centralizado */}
      {modalAbierto && (
        <div className="backend-status-modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="backend-status-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="backend-status-close" onClick={() => setModalAbierto(false)} title="Cerrar">
              <X size={18} />
            </button>

            <div className="backend-status-header">
              <Server size={26} className="backend-status-icon" />
              <h3>{BACKEND_STATUS_TEXTS.modalTitle}</h3>
            </div>

            <div className="backend-status-body">
              <div className={`status-indicator-box box-${estado.toLowerCase()}`}>
                <span className="status-dot"></span>
                <span className="status-title">
                  {estado === 'ONLINE' && BACKEND_STATUS_TEXTS.onlineTitle}
                  {estado === 'DESPERTANDO' && BACKEND_STATUS_TEXTS.wakingUpTitle}
                  {estado === 'OFFLINE' && BACKEND_STATUS_TEXTS.offlineTitle}
                </span>
              </div>

              <p className="status-detail-text">
                {estado === 'ONLINE' && BACKEND_STATUS_TEXTS.onlineDetail}
                {estado === 'DESPERTANDO' && BACKEND_STATUS_TEXTS.wakingUpDetail}
                {estado === 'OFFLINE' && BACKEND_STATUS_TEXTS.offlineDetail}
              </p>

              {estado === 'DESPERTANDO' && (
                <div className="render-info-alert">
                  <strong>{BACKEND_STATUS_TEXTS.wakingUpAlertTitle}</strong>
                  <p>{BACKEND_STATUS_TEXTS.wakingUpAlertText}</p>
                </div>
              )}

              {estado === 'OFFLINE' && (
                <div className="offline-info-alert">
                  <strong>{BACKEND_STATUS_TEXTS.offlineAlertTitle}</strong>
                  <p>{BACKEND_STATUS_TEXTS.offlineAlertText}</p>
                </div>
              )}
            </div>

            <div className="backend-status-footer">
              <button className="btn-reprobar-conexion" onClick={() => verificarEstado()}>
                <RefreshCw size={16} />
                <span>{BACKEND_STATUS_TEXTS.btnRetry}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IndicadorBackend;
