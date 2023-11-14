export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}