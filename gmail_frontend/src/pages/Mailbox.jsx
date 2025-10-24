import React, { useState } from 'react';
import MailList from '../components/mail/MailList';
import MailView from '../components/mail/MailView';

/**
 * PUBLIC_INTERFACE
 * Mailbox page to host MailList and MailView in a split-pane layout.
 * Props:
 * - mailbox: string
 * - title: string
 */
export default function Mailbox({ mailbox = 'inbox', title = 'Inbox' }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="content-inner mailbox-layout">
      <div className="layout-header">
        <h2>{title}</h2>
      </div>
      <div className="layout-body">
        <div className={`pane list ${selectedId ? 'hide-on-mobile' : ''}`}>
          <MailList
            mailbox={mailbox}
            onSelectMail={(id) => setSelectedId(id)}
          />
        </div>
        <div className={`pane view ${selectedId ? 'show' : ''}`}>
          {selectedId ? (
            <MailView mailId={selectedId} onBack={() => setSelectedId(null)} />
          ) : (
            <div className="empty card">Select an email to read</div>
          )}
        </div>
      </div>
    </div>
  );
}
