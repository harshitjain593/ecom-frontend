export const dateConverter = (unformatted) => {
    const date = new Date(unformatted);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Convert to string before padStart
    const formattedDateTime = `${day}/${month}/${year} (${hours}:${minutes})`;
    return formattedDateTime;
}
