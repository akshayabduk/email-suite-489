import React, { useEffect, useState } from 'react';
import { MailAPI } from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * MailView
 * Displays a single email with header, body and attachments.
 * Props:
 * - mailId: string
 * - onBack: function() -> void
 */
export default function MailView({ mailId, onBack }) {
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await MailAPI.get(mailId);
      setMail(data);
      if (data?.unread) {
        // auto mark as read when opened
        await MailAPI.toggleRead([mailId], true);
      }
    } catch (e) {
      // show error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mailId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailId]);

  if (!mailId) return null;

  return (
    <div className="mail-view card">
      <div className="mail-view-toolbar">
        <button className="btn" onClick={onBack}>Back</button>
        <div className="spacer" />
        <button className="btn" onClick={async ()=> { await MailAPI.toggleStar([mailId], !(mail?.starred)); await load(); }}>
          {mail?.starred ? 'Unstar' : 'Star'}
        </button>
        <button className="btn" onClick={async ()=> { await MailAPI.archive([mailId]); onBack?.(); }}>Archive</button>
        <button className="btn danger" onClick={async ()=> { await MailAPI.delete([mailId]); onBack?.(); }}>Delete</button>
        <button className="btn" onClick={async ()=> { await MailAPI.restore([mailId]); onBack?.(); }}>Restore</button>
      </div>

      {loading && <div className="empty">Loading...</div>}
      {!loading && mail && (
        <>
          <div className="mail-header">
            <h2 className="subject">{mail.subject || '(no subject)'}</h2>
            <div className="meta">
              <div className="from">
                <strong>{mail.fromName || mail.fromEmail}</strong>
                <span className="muted">&lt;{mail.fromEmail}&gt;</span>
              </div>
              <div className="to">
                To: {(mail.to || []).join(', ')}
              </div>
              <div className="date">{new Date(mail.date || mail.createdAt || Date.now()).toLocaleString()}</div>
              <div className="labels">
                {(mail.labels || []).map((l) => (
                  <span key={l.id || l} className="chip">{l.name || l}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mail-body" dangerouslySetInnerHTML={{ __html: mail.htmlBody || mail.textBody?.replace?.(/\n/g, '<br/>') || '' }} />
          {mail.attachments?.length > 0 && (
            <div className="attachments">
              <h4>Attachments</h4>
              <div className="attachment-list">
                {mail.attachments.map((a, idx) => (
                  <a
                    key={a.id || idx}
                    className="attachment"
                    href={a.url || a.downloadUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 {a.filename} ({Math.round((a.size || 0) / 1024)} KB)
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
