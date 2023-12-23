export const menuHandler = (data) => {
  return data.map(({ name, url, children }) => ({
    key: url,
    label: name,
    children: children?.map((item) => ({
      key: item.url,
      label: item.name,
    })),
  }));
};

export const formatNumber = (number?: number) => {
  if (!number) return;
  const formattedNumber = number?.toLocaleString();

  return formattedNumber;
};
