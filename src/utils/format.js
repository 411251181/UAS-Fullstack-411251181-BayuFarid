export const formatCurrency = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const formatDate = (value) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
}).format(new Date(value));

export const formatDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
};
