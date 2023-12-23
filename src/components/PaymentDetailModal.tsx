import { memo } from "react";
import { Modal } from "antd";

const PaymentDetailModal = ({ onClose, data, onConfirm }) => {
  return (
    <Modal
      width={"100%"}
      open={!!data}
      onOk={onConfirm}
      onCancel={onClose}
      okButtonProps={{ style: { background: "#198348" } }}
    >
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
            付款申请
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
            供应商名称
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
            {data?.customName}
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
            colSpan={20}
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
              textAlign: "center",
            }}
          >
            {data?.taxationNumber}
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
            付款币种
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
            付款金额
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

export default memo(PaymentDetailModal);
