import React, { useEffect, useMemo, useState } from 'react';
import { MailAPI } from '../../api/client';

/**
 * PUBLIC_INTERFACE
 * MailList
 * Renders a pageable list of mails for a given mailbox or label with search and quick filters.
 * Props:
 * - mailbox: string ('inbox'|'sent'|'drafts'|'trash'|'archive'|label:<id>)
 * - onSelectMail: function(id) -> void
 */
export default function MailList({ mailbox = 'inbox', onSelectMail }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [selected, setSelected] = useState([]);

  const filters = useMemo(() => {
    const f = {};
    if (onlyUnread) f.unread = true;
    if (onlyStarred) f.starred = true;
    return f;
  }, [onlyUnread, onlyStarred]);

  const resolvedMailbox = useMemo(() => {
    if (mailbox?.startsWith('label:')) {
      return `labels/${mailbox.split(':')[1]}`;
    }
    if (mailbox === 'archived') return 'archive';
    return mailbox || 'inbox';
  }, [mailbox]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await MailAPI.list({
        mailbox: resolvedMailbox,
        page,
        pageSize,
        query: q,
        filters
      });
      setItems(data?.items || []);
      setTotal(data?.total || 0);
    } catch (e) {
      // Optionally show toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [q, onlyUnread, onlyStarred, resolvedMailbox]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resolvedMailbox, q, onlyUnread, onlyStarred]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const allSelected = selected.length > 0 && selected.length === items.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(items.map((i) => i.id));
  };

  const onAction = async (action, payload) => {
    try {
      if (selected.length === 0) return;
      if (action === 'read') await MailAPI.toggleRead(selected, true);
      if (action === 'unread') await MailAPI.toggleRead(selected, false);
      if (action === 'star') await MailAPI.toggleStar(selected, true);
      if (action === 'unstar') await MailAPI.toggleStar(selected, false);
      if (action === 'archive') await MailAPI.archive(selected);
      if (action === 'delete') await MailAPI.delete(selected);
      if (action === 'restore') await MailAPI.restore(selected);
      if (action === 'move' && payload?.labelId) {
        await MailAPI.moveToLabel(selected, payload.labelId);
      }
      setSelected([]);
      await load();
    } catch (e) {
      // handle error UI
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mailbox card">
      <div className="mail-toolbar">
        <div className="left">
          <input
            className="search"
            placeholder="Search mail"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="chk">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
            />
            Unread
          </label>
          <label className="chk">
            <input
              type="checkbox"
              checked={onlyStarred}
              onChange={(e) => setOnlyStarred(e.target.checked)}
            />
            Starred
          </label>
        </div>
        <div className="right">
          <button className="btn" onClick={toggleSelectAll}>
            {allSelected ? 'Unselect' : 'Select all'}
          </button>
          <div className="btn-group">
            <button className="btn" onClick={() => onAction('read')}>Mark read</button>
            <button className="btn" onClick={() => onAction('unread')}>Mark unread</button>
            <button className="btn" onClick={() => onAction('star')}>Star</button>
            <button className="btn" onClick={() => onAction('unstar')}>Unstar</button>
            <button className="btn" onClick={() => onAction('archive')}>Archive</button>
            <button className="btn danger" onClick={() => onAction('delete')}>Delete</button>
            <button className="btn" onClick={() => onAction('restore')}>Restore</button>
          </div>
        </div>
      </div>

      <div className="mail-list">
        {loading && <div className="empty">Loading...</div>}
        {!loading && items.length === 0 && <div className="empty">No emails</div>}
        {!loading && items.map((m) => (
          <div
            key={m.id}
            className={`mail-row ${m.unread ? 'unread' : ''}`}
            onClick={() => onSelectMail?.(m.id)}
            role="button"
            tabIndex={0}
          >
            <input
              type="checkbox"
              className="select"
              checked={selected.includes(m.id)}
              onClick={(e)=> e.stopPropagation()}
              onChange={() => toggleSelect(m.id)}
            />
            <button
              className={`star ${m.starred ? 'on' : ''}`}
              title={m.starred ? 'Unstar' : 'Star'}
              onClick={async (e) => {
                e.stopPropagation();
                await onAction(m.starred ? 'unstar' : 'star');
              }}
            >
              ★
            </button>
            <div className="from">{m.fromName || m.fromEmail || 'Unknown'}</div>
            <div className="subject">
              {m.subject || '(no subject)'}
              {m.labels?.slice?.(0, 3)?.map((l) => (
                <span key={l.id || l} className="chip">{l.name || l}</span>
              ))}
            </div>
            <div className="time">{new Date(m.date || m.createdAt || Date.now()).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <span className="page-indicator">{page} / {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}
