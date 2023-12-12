import { memo, useMemo } from "react";
import { Modal, Descriptions } from "antd";

const DetailModal = ({ onClose, data, onConfirm }) => {
  const items = useMemo(() => {
    let arr = [];
    for (let key in data) {
      arr = [
        ...arr,
        { key: Math.random().toString(), label: key, children: data[key] },
      ];
    }
    return arr;
  }, [data]);

  return (
    <Modal
      width={"100%"}
      open={!!data}
      onOk={onConfirm}
      onCancel={onClose}
      okButtonProps={{ style: { background: "#198348" } }}
    >
      <Descriptions title="项目详情" bordered items={items} />
    </Modal>
  );
};

export default memo(DetailModal);
