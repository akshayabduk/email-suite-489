import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LabelsAPI } from '../api/client';
import Mailbox from './Mailbox';

/**
 * PUBLIC_INTERFACE
 * Labels page to route by :labelId and display Mailbox with that label.
 * When no labelId is provided, shows a hint to pick a label on the sidebar.
 */
export default function Labels() {
  const { labelId } = useParams();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    LabelsAPI.list().then(setLabels).catch(()=>{});
  }, []);

  if (!labelId) {
    return (
      <div className="content-inner">
        <h2>Labels</h2>
        <p>Select a label on the left to view its messages.</p>
        <div className="labels-cloud">
          {labels.map(l => (
            <span className="chip" key={l.id} title={l.name} style={{ borderColor: l.color || undefined }}>
              {l.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const label = labels.find(l => String(l.id) === String(labelId));
  const title = label ? `Label: ${label.name}` : 'Label';

  return <Mailbox mailbox={`label:${labelId}`} title={title} />;
}
