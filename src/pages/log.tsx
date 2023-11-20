import { getLogs } from "@/restApi/log";
import { useEffect, useState } from "react";
import { Table } from "antd";

const System = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    (async () => {
      const logs = await getLogs(page, pageSize);
      setData(logs);
      setLoading(false);
    })();
  }, [pageSize, page]);


  const columns = [
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "登录名",
      dataIndex: "loginName",
      key: "loginName",
    },
    {
      title: "操作类型",
      dataIndex: "logName",
      key: "logName",
    },
    {
      title: "操作接口",
      dataIndex: "logUrl",
      key: "logUrl",
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return <div>
    <Table
        bordered
        loading={loading}
        dataSource={data?.entity.data}
        columns={columns}
        pagination={{
          // 设置总条数
          total: data?.entity.total,
          // 显示总条数
          showTotal: (total) => `共 ${total} 条`,
          // 是否可以改变 pageSize
          showSizeChanger: true,

          // 改变页码时
          onChange: async (page) => {
            setPage(page);
          },
          // pageSize 变化的回调
          onShowSizeChange: async (page, size) => {
            setPage(page);
            setPageSize(size);
          },
        }}
      />
  </div>;
};

export default System;
