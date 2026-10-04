import { useEffect, useState } from 'react';
import { getProviderStatus } from '../api/providerApi';

export function useProviderStatus(intervalMs = 10000) {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    let active = true;
    const load = () =>
      getProviderStatus()
        .then((data) => active && setStatuses(data))
        .catch(console.error);

    load();
    const id = setInterval(load, intervalMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return statuses;
}