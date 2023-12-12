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
