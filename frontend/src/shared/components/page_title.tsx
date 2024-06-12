import { useEffect } from 'react';

export default function PageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, []);
}
