"use client";

import React, { useState, useEffect, ReactNode } from "react";
import {
  Typography,
  Flex,
  Radio,
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Modal,
  Descriptions,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import type { TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import useAppointmentStore, { Appointment } from "../../../../store/appointmentStore";
import { Table as AntdTable } from "antd";

import '@ant-design/v5-patch-for-react-19';
import { message, notification as customNotification, modal as customModal } from '../../../../store/message';
import { useActiveSession } from "../../../utilities/zustand";
import { IClinicAppointment } from "../../../interfaces/db/IAppointment";
import { appointmentStatusTypes } from "../../../constants/types";
import { allocateAppointment, cancelAppointment } from "./util";
import dayjs from "dayjs";

const { Title } = Typography;

interface ClientOnlyProps {
  children: ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : null;
};

const AppointmentsComponent: React.FC = () => {
  const router = useRouter();
  // const {
  //   appointments,
  //   setAppointments,
  //   updateStatusAndStock,
  // } = useAppointmentStore();
  const {activeAccount} = useActiveSession();

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [filteredData, setFilteredData] = useState<IClinicAppointment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IClinicAppointment | null>(null);

  useEffect(() => {
    setMounted(true);
    // Cek jika localStorage benar-benar kosong (hanya untuk inisialisasi pertama)
    // if (activeAccount?.clinic.scheduledAppointments.length === 0 && !localStorage.getItem("appointments")) {
    //   setAppointments(initialAppointments);
    // }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let filtered: IClinicAppointment[];
    switch (activeTab) {
      case "pending":
        filtered = activeAccount?.clinic.scheduledAppointments.filter((item) => item.status === appointmentStatusTypes.pending) ?? [];
        break;
      case "scheduled": // ubah dari "approve"
        filtered = activeAccount?.clinic.scheduledAppointments.filter((item) => item.status === appointmentStatusTypes.scheduled) ?? [];
        break;
      case "reject":
        filtered = activeAccount?.clinic.scheduledAppointments.filter((item) => item.status === appointmentStatusTypes.cancelled) ?? [];
        break;
      default:
        filtered = activeAccount?.clinic.scheduledAppointments ?? [];
    }
    setFilteredData(filtered);
  }, [activeTab, activeAccount?.clinic.scheduledAppointments, mounted]);

  const handleTabChange = (e: RadioChangeEvent): void => {
    setActiveTab(e.target.value);
  };

  const handleApprove = (record: IClinicAppointment): void => {
    // const success = updateStatusAndStock(record.id, "Scheduled");
    // if (!success) {
    //   customNotification.error({
    //     message: "Approval Failed",
    //     description: "Vaccine stock for this appointment is out of stock. Approval cannot be completed.",
    //     placement: "topRight",
    //   });
    // }
   customModal.confirm({
      title: "Allocate and Verify Appointment",
      content: "Are you sure you want to schedule this appointment?",
      okText: "Yes, Schedule ",
      okType: "primary",
      cancelText: "Cancel",
      onOk: async () => {
        await allocateAppointment(activeAccount?.id ?? "", record.id)
        window.location.reload();
        // updateStatusAndStock(record.id, "Rejected");
      },
    });
  };

  const handleReject = (record: IClinicAppointment): void => {
    customModal.confirm({
      title: "Reject Appointment",
      content: "Are you sure you want to reject this appointment?",
      okText: "Yes, Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await cancelAppointment(activeAccount?.id ?? "", record.id);
        window.location.reload();
        // updateStatusAndStock(record.id, "Rejected");
      },
    });
  };

  const handleView = (record: IClinicAppointment): void => {
    // Redirect both "Scheduled" and "Pending" to patient information page
    if (record.status === appointmentStatusTypes.scheduled || record.status === appointmentStatusTypes.pending) {
      router.push(`/dashboard/appointments/${record.id}`);
    } else {
      setSelectedPatient(record);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const allCount = activeAccount?.clinic.scheduledAppointments.length;
  const pendingCount = activeAccount?.clinic.scheduledAppointments.filter(
    (item) => item.status === appointmentStatusTypes.pending
  ).length;
  const scheduledCount = activeAccount?.clinic.scheduledAppointments.filter(
    (item) => item.status === appointmentStatusTypes.completed
  ).length;
  const rejectedCount = activeAccount?.clinic.scheduledAppointments.filter(
    (item) => item.status === appointmentStatusTypes.cancelled
  ).length;

  // Table columns
  const columns: TableColumnsType<IClinicAppointment> = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 500 }}>{record.user.fullName}</div>
            <div style={{ color: "#868e96", fontSize: "12px" }}>
              {record.user.id}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vaccine",
      dataIndex: "vaccineType",
      key: "vaccineType",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.vaccine.vaccineName}</span>
      ),
    },
    {
      title: "Preferred Date",
      dataIndex: "preferredDate",
      key: "preferredDate",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{dayjs(record.scheduledDate).format('DD MMMM YYYY')}</span>
      ),
    },
    {
      title: "Preferred Time",
      dataIndex: "preferredTime",
      key: "preferredTime",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.scheduledTime}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: "Pending" | "Scheduled" | "Cancelled") => {
        let color: string;
        switch (status) {
          case "Pending":
            color = "#faad14";
            break;
          case "Scheduled":
            color = "#1677ff";
            break;
          case "Cancelled":
            color = "#52c41a";
            break;
          default:
            color = "#1677ff";
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isDisabled = record.status === appointmentStatusTypes.cancelled;
        const disabledColor = "#d9d9d9";
        return (
          <Space size="middle">
            <Tooltip title="Schedule">
              <Button
                type="text"
                disabled={isDisabled || record.status === appointmentStatusTypes.scheduled}
                icon={
                  <CheckOutlined
                    style={{ color: isDisabled || record.status === appointmentStatusTypes.scheduled ? disabledColor : "green" }}
                  />
                }
                onClick={() => handleApprove(record)}
              />
            </Tooltip>
            <Tooltip title="Reject">
              <Button
                type="text"
                disabled={isDisabled}
                icon={
                  <CloseOutlined
                    style={{ color: isDisabled ? disabledColor : "red" }}
                  />
                }
                onClick={() => handleReject(record)}
              />
            </Tooltip>
            {record.status !== appointmentStatusTypes.completed && (
              <Tooltip title={record.status === appointmentStatusTypes.cancelled ? "Cannot view rejected patient" : "View Details"}>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(record)}
                  disabled={record.status === appointmentStatusTypes.cancelled}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>Appointment Management</Title>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            type="default"
            onClick={() => {
              // Export
              const csvRows = [
                [
                  "Patient Name",
                  "Patient ID",
                  "Vaccine Type",
                  "Preferred Date",
                  "Preferred Time",
                  "Status",
                  "Gender",
                  "Date of Birth"
                ],
                ...activeAccount?.clinic.scheduledAppointments.map(a => [
                  a.user.fullName,
                  a.user.id,
                  a.vaccine.vaccineName,
                  a.scheduledDate,
                  a.scheduledTime,
                  a.status,
                  a.user.gender,
                  a.user.dateOfBirth
                ]) ?? []
              ];
              const csvContent = csvRows.map(e => e.join(",")).join("\n");
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "appointments_report.csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          >
            Export Report
          </Button>
          <Button
            type="primary"
            onClick={() => router.push("/dashboard/appointments/history")}
          >
            Appointment History
          </Button>
        </div>
      </div>
      {!mounted ? (
        <div>Loading...</div>
      ) : (
        <ClientOnly>
          <Flex vertical gap="middle">
            <Radio.Group
              value={activeTab}
              onChange={handleTabChange}
              style={{ marginBottom: "20px" }}
              buttonStyle="solid"
            >
              <Radio.Button value="pending">Pending ({pendingCount})</Radio.Button>
              <Radio.Button value="scheduled">Scheduled ({scheduledCount})</Radio.Button>
              <Radio.Button value="reject">Rejected ({rejectedCount})</Radio.Button>
            </Radio.Group>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              style={{ borderRadius: "8px", overflow: "hidden" }}
              scroll={{ x: "max-content" }}
            />
          </Flex>
          {/* Appointment Details Modal */}
          <Modal
            title="Appointment Details"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={700}
            styles={{ body: { padding: 24 } }} 
          >
            {selectedPatient && (
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{selectedPatient.user.fullName}</div>
                    <div style={{ color: "#868e96", fontSize: 14 }}>{selectedPatient.user.id}</div>
                  </div>
                </div>
                <Descriptions
                  column={1}
                  size="middle"
                  style={{ marginBottom: 12 }}
                  styles={{
                    label: { fontWeight: 500, width: 140 },
                    content: { fontWeight: 400 },
                  }}
                >
                  <Descriptions.Item label="Gender">
                    {selectedPatient.user.gender || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {dayjs(selectedPatient.user.dateOfBirth).format('DD MMMM YYYY')|| "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {selectedPatient.user.dateOfBirth
                      ? `${Math.floor(
                          (new Date().getTime() - new Date(selectedPatient.user.dateOfBirth).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )} years`
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vaccine Type">
                    {selectedPatient.vaccine.vaccineName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={
                      selectedPatient.status === appointmentStatusTypes.pending
                        ? "#faad14"
                        : selectedPatient.status === appointmentStatusTypes.scheduled
                        ? "#52c41a"
                        : "#ff4d4f"
                    }>
                      {selectedPatient.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                {/* <div style={{ marginTop: 24 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>
                    Vaccination History:
                  </div>
                  {selectedPatient.vaccinationHistory && selectedPatient.vaccinationHistory.length > 0 ? (
                    <Table
                      dataSource={selectedPatient.vaccinationHistory.map((v, idx) => ({ ...v, key: idx }))}
                      pagination={false}
                      size="small"
                      columns={[
                        { title: "Vaccine Name", dataIndex: "name", key: "name" },
                        { title: "Date", dataIndex: "date", key: "date" },
                        { title: "Dose", dataIndex: "dose", key: "dose" },
                      ]}
                      style={{ margin: 0 }}
                    />
                  ) : (
                    "-"
                  )}
                </div> */}
              </div>
            )}
          </Modal>
        </ClientOnly>
      )}
    </div>
  );
};

export default AppointmentsComponent;
