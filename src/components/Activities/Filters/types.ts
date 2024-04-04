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
export type Status = typeof statuses[number];
export type StatusValue = Status['value'];
