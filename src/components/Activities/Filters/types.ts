export const statuses = [
  {
    value: undefined,
    label: 'All',
  },
  {
    value: 'IN' as const,
    label: 'Received',
  },
  {
    value: 'OUT' as const,
    label: 'Sent',
  },
  {
    value: 'PENDING' as const,
    label: 'Pending',
  },
];
export type StatusValue = typeof statuses[number]['value'];
