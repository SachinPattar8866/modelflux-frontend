import { useEffect, useState } from 'react';
import { getProviderStatus } from '../../api/providerApi';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  RATE_LIMITED: 'bg-yellow-100 text-yellow-700',
  DOWN: 'bg-red-100 text-red-700',
};

export default function ProviderStatusBar() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatus = () => {
      getProviderStatus().then(setStatuses).catch(console.error);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 px-4 py-2 border-b bg-white">
      {statuses.map((s) => (
        <span
          key={s.provider}
          className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[s.status]}`}
        >
          {s.provider}
          {s.status === 'RATE_LIMITED' && s.resetInSeconds ? ` (${s.resetInSeconds}s)` : ''}
        </span>
      ))}
    </div>
  );
}