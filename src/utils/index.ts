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

export const formatMenu = (menu) => {
  return menu.map((c) => {
    return {
      ...c,
      title: c.name,
      key: c.id,
      children: c.children ? formatMenu(c.children) : c.children,
    };
  });
};
