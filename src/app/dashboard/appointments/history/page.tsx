"use client";

import { Table, Typography, Tag, Breadcrumb } from "antd";
import { useRouter } from "next/navigation";
import useAppointmentStore, {Appointment} from "../../../../../store/appointmentStore";
const { Title } = Typography;

export default function AppointmentHistory() {
  const router = useRouter();
  const { appointments } = useAppointmentStore();

  // Filter hanya yang status Completed
  const completedAppointments = appointments.filter(
    (a: Appointment) => a.status === "Completed"
  );

  const columns = [
    { title: "Patient", dataIndex: "patientName", key: "patientName" },
    { title: "Patient ID", dataIndex: "patientId", key: "patientId" },
    { title: "Vaccine", dataIndex: "vaccineType", key: "vaccineType" },
    { title: "Date", dataIndex: "preferredDate", key: "preferredDate" },
    { title: "Time", dataIndex: "preferredTime", key: "preferredTime" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Tag color="#52c41a">Completed</Tag>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb
        items={[
          { title: "Dashboard", href: "/" },
          { title: "Appointments", href: "/dashboard/appointments" },
          { title: "History" },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Title level={4}>Appointment History</Title>
      <Table columns={columns} dataSource={completedAppointments} rowKey="key" />
    </div>
  );
}