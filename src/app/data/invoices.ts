interface Status {
    id: 'open' | 'paid' | 'void' | 'uncollectible';
    label: string;
  }
  



export const AVAILABLE_STATUSES: Status[] = [
    {
      id: 'open',
      label: 'Open',
    },
    {
      id: 'paid',
      label: 'Paid',
    },
    {
      id: 'void',
      label: 'Void',
    },
    {
      id: 'uncollectible',
      label: 'Uncollectible',
    },
  ]