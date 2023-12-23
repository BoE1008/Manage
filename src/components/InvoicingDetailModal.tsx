import { memo, useMemo } from "react";
import { Modal, Descriptions } from "antd";

const InvoicingDetailModal = ({ onClose, data, onConfirm }) => {
  return (
    <Modal
      width={"100%"}
      open={!!data}
      onOk={onConfirm}
      onCancel={onClose}
      okButtonProps={{ style: { background: "#198348" } }}
    >
      {/* <Descriptions title="项目详情" bordered items={items} /> */}

      <table style={{ width: "100%" }}>
        <tr
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "700",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <td
            colSpan={20}
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            开票申请
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            申请时间
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.createTime}
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            申请人
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.userName}
          </td>
        </tr>

        <tr
          style={{
            paddingTop: "20px",
            paddingBottom: "20px",
            border: "1px solid #333333",
          }}
        >
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            项目名称
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              textAlign: "center",
            }}
          >
            {data?.projectName}
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            客户名称
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.customName}
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            开票内容
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.content}
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            税号
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.taxationNumber}
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            开票票种
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.invoicingType}
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            地址电话
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            xxx
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            开票币种
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.moneyType}
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            银行账户
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.bankCard}
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            开票金额
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.fee}
          </td>
        </tr>

        <tr>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            备注：
          </td>
          <td
            colSpan={20}
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.remark}
          </td>
        </tr>
      </table>
    </Modal>
  );
};

export default memo(InvoicingDetailModal);
