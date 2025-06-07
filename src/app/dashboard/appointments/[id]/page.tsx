"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
  import { Button, Tag, Typography, Breadcrumb, Table, Row, Col, TableColumnsType } from "antd";
import useAppointmentStore from "../../../../../store/appointmentStore";
import { useActiveSession } from "../../../../utilities/zustand";
import { appointmentStatusTypes } from "../../../../constants/types";
import { IVaccinationHistory } from "../../../../interfaces/db/IUser";
import { completeAppointment } from "../util";

const { Title } = Typography;

export default function AppointmentDetail() {
  const router = useRouter();
  const params = useParams();
  const { activeAccount } = useActiveSession();
  // const { appointments, updateStatus } = useAppointmentStore();
  const appointment = activeAccount?.clinic.scheduledAppointments.find((a) => a.id === params.id);

  // useEffect(() => {
  //   // Redirect jika appointment tidak ditemukan atau status bukan Approved
  //   if (!appointment || appointment.status !== "Scheduled") {
  //     router.replace("/appointments/history");
  //   }
  // }, [appointment, router]);

  const handleComplete = async () => {
    if (appointment) {
      await completeAppointment(activeAccount?.id ?? "", appointment.id)
      // updateStatus(appointment.id, "Completed");
      router.replace("/dashboard/appointments/history");
      window.location.reload();
    }
  };

  if (!appointment) return <div>Loading...</div>;

  // Hitung umur
  const getAge = (dob?: string) => {
    if (!dob) return "-";
    const diff = new Date().getTime() - new Date(dob).getTime();
    return `${Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))} years`;
  };

  const columns : TableColumnsType<IVaccinationHistory> = [
    {
      title: "Vaccine",
      // dataIndex: "vaccineType",
      // key: "vaccineType",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.vaccine.vaccineName}</span>
      ),
    },
    {
      title: "Date",
      // dataIndex: "vaccineType",
      // key: "vaccineType",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.vaccinationDate.toISOString()}</span>
      ),
    },
    {
      title: "Dose",
      // dataIndex: "vaccineType",
      // key: "vaccineType",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>{record.doseNumber}</span>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <Breadcrumb
        items={[
          { title: "Dashboard", href: "/" },
          { title: "Appointments", href: "/dashboard/appointments" },
          { title: "Patient Information" },
        ]}
        style={{ marginBottom: 24 }}
      />

      {/* Section 1: Patient Info */}
      <div
        style={{
          margin: "0 auto 32px auto",
          padding: "12px 24px 24px 24px",
          borderRadius: 12,
          background: "#fafbfc",
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
          // maxWidth: 900,
        }}
      >
        <Title level={4} style={{ marginBottom: 20 }}>Patient Information</Title>
        <Row gutter={32} align="middle">
          <Col xs={24} md={14}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                {appointment.user.fullName}
              </div>
              <div style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>
                {appointment.user.id}
              </div>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Gender</div>
                  <div style={{ fontWeight: 500 }}>{appointment.user.gender || "-"}</div>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Date of Birth</div>
                  <div style={{ fontWeight: 500 }}>{appointment.user.dateOfBirth.toISOString() || "-"}</div>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Age</div>
                  <div style={{ fontWeight: 500 }}>{getAge(appointment.user.dateOfBirth.toISOString())}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: "right", marginTop: 12 }}>
            <Tag
              color={
                appointment.status === appointmentStatusTypes.pending
                  ? "#faad14"
                  : appointment.status === appointmentStatusTypes.scheduled
                  ? "#1677ff"
                  : appointment.status === appointmentStatusTypes.cancelled
                  ? "#ff4d4f"
                  : "#52c41a"
              }
              style={{
                fontSize: 16,
                padding: "6px 18px",
                // borderRadius: 20,
                fontWeight: 500,
                minWidth: 100,
                textAlign: "center",
                display: "inline-block",
              }}
            >
              {appointment.status}
            </Tag>
          </Col>
        </Row>
      </div>

      {/* Section 2: Appointment Information */}
      <div
        style={{
          // maxWidth: 900,
          margin: "0 auto 32px auto",
          padding: "12px 24px 24px 24px",
          borderRadius: 12,
          background: "#fafbfc",
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
        }}
      >
        <Title level={4} style={{ marginBottom: 20 }}>Appointment Information</Title>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: 12 }}>
              <strong>Vaccine Name:</strong> <span style={{ marginLeft: 8 }}>{appointment.vaccine.vaccineName}</span>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: 12 }}>
              <strong>Preferred Date:</strong> <span style={{ marginLeft: 8 }}>{appointment.scheduledDate.toISOString()}</span>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: 12 }}>
              <strong>Preferred Time:</strong> <span style={{ marginLeft: 8 }}>{appointment.scheduledTime}</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Section 3: Vaccination History */}
      <div
        style={{
          // maxWidth: 900,
          margin: "0 auto 32px auto",
          padding: "12px 24px 24px 24px",
          borderRadius: 12,
          background: "#fafbfc",
          boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
        }}
      >
        <Title level={4} style={{ marginBottom: 20 }}>Vaccination History</Title>
        {appointment.user.vaccinationHistory && appointment.user.vaccinationHistory.length > 0 ? (
          <Table
            dataSource={appointment.user.vaccinationHistory.map((v, idx) => ({ ...v, key: idx }))}
            pagination={false}
            size="small"
            // columns={[
            //   { title: "Vaccine Name", dataIndex: "name", key: "name" },
            //   { title: "Date", dataIndex: "date", key: "date" },
            //   { title: "Dose", dataIndex: "dose", key: "dose" },
            // ]}
            columns={columns}
             style={{
              margin: 0,
              marginBottom: 24,
              width: "100%",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(4, 4, 4, 0.14)",
            }}
          />
        ) : (
          <div style={{ marginBottom: 24 }}>-</div>
        )}
        <Button
          type="primary"
          size="large"
          style={{
            fontSize: 18,
            height: 56,
            fontWeight: 600,
            letterSpacing: 1,
            marginTop: 8,
            borderRadius: 8,
            width: 320,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={handleComplete}
          disabled={appointment.status === "Pending"}
        >
          Appointment Complete
        </Button>
      </div>
    </div>
  );
}