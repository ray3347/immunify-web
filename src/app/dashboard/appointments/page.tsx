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

const initialAppointments: Appointment[] = [
  {
    key: "1",
    patientId: "PAT-2025-101",
    patientName: "Alicia Morgan",
    patientInitials: "AM",
    preferredDate: "June 1, 2025",
    preferredTime: "09:00 AM",
    vaccineType: "COVID-19 Booster",
    status: "Pending",
    gender: "Female",
    dob: "1995-04-12",
    vaccinationHistory: [
      { name: "COVID-19 Booster", date: "2024-06-01", dose: "2" },
      { name: "Flu Shot", date: "2023-11-10", dose: "1" },
    ],
  },
  {
    key: "2",
    patientId: "PAT-2025-102",
    patientName: "Brian Lee",
    patientInitials: "BL",
    preferredDate: "June 2, 2025",
    preferredTime: "10:30 AM",
    vaccineType: "Hepatitis B",
    status: "Pending",
    gender: "Male",
    dob: "1988-09-23",
    vaccinationHistory: [
      { name: "Hepatitis B", date: "2023-09-23", dose: "2" },
    ],
  },
  {
    key: "3",
    patientId: "PAT-2025-103",
    patientName: "Carla Gomez",
    patientInitials: "CG",
    preferredDate: "June 3, 2025",
    preferredTime: "01:15 PM",
    vaccineType: "HPV Vaccine",
    status: "Scheduled",
    gender: "Female",
    dob: "2001-02-14",
    vaccinationHistory: [
      { name: "HPV Vaccine", date: "2024-02-14", dose: "1" },
    ],
  },
  {
    key: "4",
    patientId: "PAT-2025-104",
    patientName: "Daniel Smith",
    patientInitials: "DS",
    preferredDate: "June 4, 2025",
    preferredTime: "11:45 AM",
    vaccineType: "Tdap",
    status: "Rejected",
    gender: "Male",
    dob: "1992-07-30",
    vaccinationHistory: [
      { name: "Tdap", date: "2023-07-30", dose: "1" },
      { name: "Flu Shot", date: "2022-10-05", dose: "1" },
    ],
  },
  {
    key: "5",
    patientId: "PAT-2025-105",
    patientName: "Emily Chen",
    patientInitials: "EC",
    preferredDate: "June 5, 2025",
    preferredTime: "03:00 PM",
    vaccineType: "Shingles Vaccine",
    status: "Pending",
    gender: "Female",
    dob: "1978-12-05",
    vaccinationHistory: [
      { name: "Shingles Vaccine", date: "2024-12-05", dose: "1" },
    ],
  },
  {
    key: "6",
    patientId: "PAT-2025-106",
    patientName: "Franklin Turner",
    patientInitials: "FT",
    preferredDate: "June 6, 2025",
    preferredTime: "08:30 AM",
    vaccineType: "Pneumococcal Vaccine",
    status: "Pending",
    gender: "Male",
    dob: "1965-03-18",
    vaccinationHistory: [
      { name: "Pneumococcal Vaccine", date: "2023-03-18", dose: "1" },
    ],
  },
  {
    key: "7",
    patientId: "PAT-2025-107",
    patientName: "Grace Kim",
    patientInitials: "GK",
    preferredDate: "June 7, 2025",
    preferredTime: "02:45 PM",
    vaccineType: "Flu Shot",
    status: "Scheduled",
    gender: "Female",
    dob: "1999-08-22",
    vaccinationHistory: [
      { name: "Flu Shot", date: "2024-08-22", dose: "1" },
      { name: "COVID-19 Booster", date: "2023-08-22", dose: "2" },
    ],
  },
  {
    key: "8",
    patientId: "PAT-2025-108",
    patientName: "Henry Adams",
    patientInitials: "HA",
    preferredDate: "June 8, 2025",
    preferredTime: "12:00 PM",
    vaccineType: "COVID-19 Booster",
    status: "Rejected",
    gender: "Male",
    dob: "1985-11-11",
    vaccinationHistory: [
      { name: "COVID-19 Booster", date: "2024-11-11", dose: "2" },
    ],
  },
  {
    key: "9",
    patientId: "PAT-2025-109",
    patientName: "Isabella Rossi",
    patientInitials: "IR",
    preferredDate: "June 9, 2025",
    preferredTime: "04:30 PM",
    vaccineType: "HPV Vaccine",
    status: "Pending",
    gender: "Female",
    dob: "2003-05-19",
    vaccinationHistory: [
      { name: "HPV Vaccine", date: "2024-05-19", dose: "1" },
    ],
  },
  {
    key: "10",
    patientId: "PAT-2025-110",
    patientName: "Jack Brown",
    patientInitials: "JB",
    preferredDate: "June 10, 2025",
    preferredTime: "10:00 AM",
    vaccineType: "Hepatitis B",
    status: "Pending",
    gender: "Male",
    dob: "1990-10-10",
    vaccinationHistory: [
      { name: "Hepatitis B", date: "2023-10-10", dose: "2" },
    ],
  },
  {
    key: "11",
    patientId: "PAT-2025-111",
    patientName: "Maya Putri",
    patientInitials: "MP",
    preferredDate: "May 15, 2025",
    preferredTime: "08:00 AM",
    vaccineType: "COVID-19 Booster",
    status: "Pending",
    gender: "Female",
    dob: "1994-03-12",
    vaccinationHistory: [
      { name: "COVID-19 Booster", date: "2024-05-15", dose: "1" },
    ],
  },
  {
    key: "12",
    patientId: "PAT-2025-112",
    patientName: "Rizky Hidayat",
    patientInitials: "RH",
    preferredDate: "May 15, 2025",
    preferredTime: "09:00 AM",
    vaccineType: "Flu Shot",
    status: "Scheduled",
    gender: "Male",
    dob: "1990-07-21",
    vaccinationHistory: [
      { name: "Flu Shot", date: "2024-05-15", dose: "1" },
    ],
  },
  {
    key: "13",
    patientId: "PAT-2025-113",
    patientName: "Siti Aminah",
    patientInitials: "SA",
    preferredDate: "May 15, 2025",
    preferredTime: "10:00 AM",
    vaccineType: "HPV Vaccine",
    status: "Pending",
    gender: "Female",
    dob: "1998-11-05",
    vaccinationHistory: [
      { name: "HPV Vaccine", date: "2024-05-15", dose: "1" },
    ],
  },
  {
    key: "14",
    patientId: "PAT-2025-114",
    patientName: "Budi Santoso",
    patientInitials: "BS",
    preferredDate: "May 15, 2025",
    preferredTime: "11:00 AM",
    vaccineType: "Hepatitis B",
    status: "Scheduled",
    gender: "Male",
    dob: "1987-02-18",
    vaccinationHistory: [
      { name: "Hepatitis B", date: "2024-05-15", dose: "2" },
    ],
  },
  {
    key: "15",
    patientId: "PAT-2025-115",
    patientName: "Dewi Lestari",
    patientInitials: "DL",
    preferredDate: "May 15, 2025",
    preferredTime: "01:00 PM",
    vaccineType: "Tdap",
    status: "Pending",
    gender: "Female",
    dob: "1992-09-30",
    vaccinationHistory: [
      { name: "Tdap", date: "2024-05-15", dose: "1" },
    ],
  },
  {
    key: "16",
    patientId: "PAT-2025-116",
    patientName: "Andi Wijaya",
    patientInitials: "AW",
    preferredDate: "May 3, 2025",
    preferredTime: "09:30 AM",
    vaccineType: "COVID-19 Booster",
    status: "Scheduled",
    gender: "Male",
    dob: "1985-06-10",
    vaccinationHistory: [
      { name: "COVID-19 Booster", date: "2024-05-03", dose: "2" },
    ],
  },
  {
    key: "17",
    patientId: "PAT-2025-117",
    patientName: "Lina Hartono",
    patientInitials: "LH",
    preferredDate: "May 7, 2025",
    preferredTime: "10:00 AM",
    vaccineType: "Flu Shot",
    status: "Pending",
    gender: "Female",
    dob: "1996-12-22",
    vaccinationHistory: [
      { name: "Flu Shot", date: "2024-05-07", dose: "1" },
    ],
  },
  {
    key: "18",
    patientId: "PAT-2025-118",
    patientName: "Yusuf Maulana",
    patientInitials: "YM",
    preferredDate: "May 10, 2025",
    preferredTime: "11:00 AM",
    vaccineType: "HPV Vaccine",
    status: "Scheduled",
    gender: "Male",
    dob: "1993-04-17",
    vaccinationHistory: [
      { name: "HPV Vaccine", date: "2024-05-10", dose: "1" },
    ],
  },
  {
    key: "19",
    patientId: "PAT-2025-119",
    patientName: "Sari Dewi",
    patientInitials: "SD",
    preferredDate: "May 20, 2025",
    preferredTime: "08:30 AM",
    vaccineType: "Shingles Vaccine",
    status: "Pending",
    gender: "Female",
    dob: "1989-08-25",
    vaccinationHistory: [
      { name: "Shingles Vaccine", date: "2024-05-20", dose: "1" },
    ],
  },
  {
    key: "20",
    patientId: "PAT-2025-120",
    patientName: "Tommy Gunawan",
    patientInitials: "TG",
    preferredDate: "May 25, 2025",
    preferredTime: "02:00 PM",
    vaccineType: "Hepatitis B",
    status: "Scheduled",
    gender: "Male",
    dob: "1991-01-15",
    vaccinationHistory: [
      { name: "Hepatitis B", date: "2024-05-25", dose: "2" },
    ],
  },
];

const AppointmentsComponent: React.FC = () => {
  const router = useRouter();
  const {
    appointments,
    setAppointments,
    updateStatusAndStock,
  } = useAppointmentStore();

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [filteredData, setFilteredData] = useState<Appointment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);

  useEffect(() => {
    setMounted(true);
    // Cek jika localStorage benar-benar kosong (hanya untuk inisialisasi pertama)
    if (appointments.length === 0 && !localStorage.getItem("appointments")) {
      setAppointments(initialAppointments);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let filtered: Appointment[];
    switch (activeTab) {
      case "pending":
        filtered = appointments.filter((item) => item.status === "Pending");
        break;
      case "scheduled": // ubah dari "approve"
        filtered = appointments.filter((item) => item.status === "Scheduled");
        break;
      case "reject":
        filtered = appointments.filter((item) => item.status === "Rejected");
        break;
      default:
        filtered = appointments;
    }
    setFilteredData(filtered);
  }, [activeTab, appointments, mounted]);

  const handleTabChange = (e: RadioChangeEvent): void => {
    setActiveTab(e.target.value);
  };

  const handleApprove = (record: Appointment): void => {
    const success = updateStatusAndStock(record.key, "Scheduled");
    if (!success) {
      customNotification.error({
        message: "Approval Failed",
        description: "Vaccine stock for this appointment is out of stock. Approval cannot be completed.",
        placement: "topRight",
      });
    }
  };

  const handleReject = (record: Appointment): void => {
    customModal.confirm({
      title: "Reject Appointment",
      content: "Are you sure you want to reject this appointment?",
      okText: "Yes, Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        updateStatusAndStock(record.key, "Rejected");
      },
    });
  };

  const handleView = (record: Appointment): void => {
    // Redirect both "Scheduled" and "Pending" to patient information page
    if (record.status === "Scheduled" || record.status === "Pending") {
      router.push(`/dashboard/appointments/${record.key}`);
    } else {
      setSelectedPatient(record);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const allCount = appointments.length;
  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;
  const scheduledCount = appointments.filter(
    (item) => item.status === "Scheduled"
  ).length;
  const rejectedCount = appointments.filter(
    (item) => item.status === "Rejected"
  ).length;

  // Table columns
  const columns: TableColumnsType<Appointment> = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 500 }}>{record.patientName}</div>
            <div style={{ color: "#868e96", fontSize: "12px" }}>
              {record.patientId}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vaccine",
      dataIndex: "vaccineType",
      key: "vaccineType",
      render: (vaccineType: string) => (
        <span style={{ fontWeight: 500 }}>{vaccineType}</span>
      ),
    },
    {
      title: "Preferred Date",
      dataIndex: "preferredDate",
      key: "preferredDate",
    },
    {
      title: "Preferred Time",
      dataIndex: "preferredTime",
      key: "preferredTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: "Pending" | "Scheduled" | "Rejected") => {
        let color: string;
        switch (status) {
          case "Pending":
            color = "#faad14";
            break;
          case "Scheduled":
            color = "#1677ff";
            break;
          case "Rejected":
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
        const isDisabled = record.status === "Rejected";
        const disabledColor = "#d9d9d9";
        return (
          <Space size="middle">
            <Tooltip title="Schedule">
              <Button
                type="text"
                disabled={isDisabled || record.status === "Scheduled"}
                icon={
                  <CheckOutlined
                    style={{ color: isDisabled || record.status === "Scheduled" ? disabledColor : "green" }}
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
            {record.status !== "Completed" && (
              <Tooltip title={record.status === "Rejected" ? "Cannot view rejected patient" : "View Details"}>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(record)}
                  disabled={record.status === "Rejected"}
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
                ...appointments.map(a => [
                  a.patientName,
                  a.patientId,
                  a.vaccineType,
                  a.preferredDate,
                  a.preferredTime,
                  a.status,
                  a.gender,
                  a.dob
                ])
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
              rowKey="key"
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
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{selectedPatient.patientName}</div>
                    <div style={{ color: "#868e96", fontSize: 14 }}>{selectedPatient.patientId}</div>
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
                    {selectedPatient.gender || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {selectedPatient.dob || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {selectedPatient.dob
                      ? `${Math.floor(
                          (new Date().getTime() - new Date(selectedPatient.dob).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )} years`
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vaccine Type">
                    {selectedPatient.vaccineType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={
                      selectedPatient.status === "Pending"
                        ? "#faad14"
                        : selectedPatient.status === "Scheduled"
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
