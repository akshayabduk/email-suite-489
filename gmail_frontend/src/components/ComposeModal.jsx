import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MailAPI } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * ComposeModal
 * A modal dialog to compose an email with To, Subject, Body, and multi-file attachments.
 * Props:
 * - open: boolean -> controls visibility
 * - onClose: function() -> void
 * - onSent: function(message) -> void   // called after successful send
 * - onDraftSaved: function(draft) -> void // called after saving draft
 */
export default function ComposeModal({ open, onClose, onSent, onDraftSaved }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]); // [{id, filename, size, url}]
  const [draftId, setDraftId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      // reset when closing
      setTo('');
      setSubject('');
      setBody('');
      setUploading(false);
      setSending(false);
      setSaving(false);
      setError('');
      setAttachments([]);
      setDraftId(null);
    }
  }, [open]);

  const recipients = useMemo(() => {
    return to
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [to]);

  const onSelectFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      let ensuredDraftId = draftId;
      // Ensure we have a draftId to associate attachments (backend friendly)
      if (!ensuredDraftId) {
        const draft = await MailAPI.saveDraft({
          to: recipients,
          subject,
          body,
          attachments: [],
        });
        ensuredDraftId = draft?.id;
        setDraftId(ensuredDraftId || null);
        if (draft && onDraftSaved) onDraftSaved(draft);
      }

      const uploads = [];
      for (const f of files) {
        const res = await MailAPI.uploadAttachment(f, { draftId: ensuredDraftId });
        uploads.push(res);
      }
      setAttachments((prev) => [...prev, ...uploads]);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to upload attachments.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    onSelectFiles(files);
  };

  const onSend = async () => {
    setSending(true);
    setError('');
    try {
      const sent = await MailAPI.compose({
        to: recipients,
        subject,
        body,
        attachments: attachments.map(a => a.id || a),
      });
      onSent?.(sent);
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  const onSaveDraft = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await MailAPI.saveDraft({
        to: recipients,
        subject,
        body,
        attachments: attachments.map(a => a.id || a),
        id: draftId || undefined
      });
      if (!draftId && res?.id) setDraftId(res.id);
      onDraftSaved?.(res);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="compose-backdrop" onClick={(e) => { if (e.target.classList.contains('compose-backdrop')) onClose?.(); }}>
      <div className="compose-modal card" role="dialog" aria-modal="true" aria-label="Compose email">
        <div className="compose-header">
          <h3>New message</h3>
          <button className="btn small" onClick={onClose} aria-label="Close compose">✕</button>
        </div>

        {error && <div className="compose-error">{error}</div>}

        <div className="compose-field">
          <label>To</label>
          <input
            type="text"
            placeholder="recipient1@example.com, recipient2@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="compose-field">
          <label>Subject</label>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="compose-field">
          <label>Message</label>
          <textarea
            placeholder="Write your message..."
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div
          className="compose-attachments"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="attach-actions">
            <button
              className="btn"
              onClick={() => fileInputRef.current?.click()}
            >
              📎 Add attachments
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => onSelectFiles(e.target.files)}
            />
            {uploading && <span className="muted">Uploading...</span>}
          </div>
          {attachments.length > 0 && (
            <div className="attachment-list">
              {attachments.map((a, idx) => (
                <div key={a.id || idx} className="attachment-pill">
                  <span>📎 {a.filename || a.name || 'file'}</span>
                  <button
                    className="pill-remove"
                    onClick={() => {
                      setAttachments((prev) =>
                        prev.filter((x, i) => i !== idx)
                      );
                    }}
                    aria-label="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="attach-hint">Drag & drop files here</div>
        </div>

        <div className="compose-footer">
          <button
            className="btn primary"
            onClick={onSend}
            disabled={sending || uploading || recipients.length === 0}
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
          <button
            className="btn"
            onClick={onSaveDraft}
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <div className="spacer" />
          <span className="muted small">{draftId ? `Draft #${draftId}` : 'New draft'}</span>
        </div>
      </div>
    </div>
  );
}
