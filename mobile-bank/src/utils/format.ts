export const formatCurrency = (value?: number, currency = 'USD') =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export const formatCompactCurrency = (value?: number, currency = 'USD'): string => {
  const num = value ?? 0;
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1000000) {
    // Millions
    return `${sign}${currency === 'USD' ? '$' : ''}${(absNum / 1000000).toFixed(1)}M`;
  } else if (absNum >= 1000) {
    // Thousands
    return `${sign}${currency === 'USD' ? '$' : ''}${(absNum / 1000).toFixed(1)}K`;
  } else {
    // Less than 1000, use regular format
    return formatCurrency(num, currency);
  }
};

export const formatDate = (value?: string | Date) => {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString();
};

export const maskCardNumber = (cardNumber?: string) => {
  if (!cardNumber) return '•••• •••• •••• ••••';
  const sanitized = cardNumber.replace(/\s+/g, '');
  const masked = sanitized
    .split('')
    .map((char, index) => (index < sanitized.length - 4 ? '•' : char))
    .join('');
  return masked.replace(/(.{4})/g, '$1 ').trim();
};
