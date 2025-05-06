
export const checkUser = () => {
    const user = localStorage.getItem('token');
    return !!user; // Convert to boolean
  };

export function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}