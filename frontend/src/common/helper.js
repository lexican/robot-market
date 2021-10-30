export const formatDate = (pDate) => {
  var date = new Date(pDate);
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "-" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "-" +
    date.getFullYear()
  );
};

export const formatPrice = (price) => {
  var formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(price);
  return formattedPrice;
};

