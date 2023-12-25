import { memo, useEffect, useState } from "react";
import { Modal, Upload, Button } from "antd";
import {
  getFilesById,
  deleteFileById,
  updateFileById,
} from "@/restApi/payment";
import { UploadOutlined } from "@ant-design/icons";

const PaymentDetailModal = ({ onClose, data, onConfirm }) => {
  const [files, setFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);

  useEffect(() => {
    (async () => {
      const rawFilelist = await getFilesById(data?.id);
      const fileList = rawFilelist?.entity.data.map((item) => ({
        name: item.originalFileName,
        url: item.url,
        id: item.id,
        uid: item.id,
        status: "done",
      }));

      setOldFiles(fileList);
      setFiles(fileList);
    })();
  }, [data?.id]);

  const handleConfirm = async () => {
    console.log(oldFiles, "oldFiles");
    console.log(files, "files");
    const fileList = files.filter(
      (itemA) => !oldFiles.some((itemB) => itemA.name === itemB.name)
    );

    console.log(fileList, "fileList");
    const formData = new FormData();

    formData.append("paymentId", data?.id);

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append("files", file);
      });
      await updateFileById(formData);
    }

    onConfirm();
  };

  const uploadProps = {
    accept: ".pdf,.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.rar,.zip",
    name: "file",
    multiple: true,
    fileList: files,
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: false,
    },
    onRemove: async (file) => {
      await deleteFileById(file?.id);
      const index = files?.indexOf(file);
      const newFiles = files.slice();
      newFiles.splice(index, 1);
      setFiles(newFiles);
    },
    beforeUpload: (file) => {
      setFiles([...files, file]);
      return false;
    },
    onDownload: async (file) => {
      window.open(
        `http://123.60.88.8/zc/common/download/resource?resource=${file?.url}`
      );
    },
  };
  return (
    <Modal
      width={"80%"}
      open={!!data}
      onOk={handleConfirm}
      onCancel={onClose}
      okButtonProps={{ style: { background: "#198348" } }}
    >
      <table style={{ width: "100%", marginBottom: "20px" }}>
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
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              border: "1px solid #333333",
            }}
          >
            项目编号
          </td>
          <td
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              textAlign: "center",
            }}
          >
            {data?.projectNum}
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

      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>点击上传</Button>
      </Upload>
    </Modal>
  );
};

export default memo(PaymentDetailModal);
