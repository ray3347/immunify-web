"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
  import { Button, Tag, Typography, Breadcrumb, Table, Row, Col } from "antd";
import useAppointmentStore from "../../../../../store/appointmentStore";

const { Title } = Typography;

export default function AppointmentDetail() {
  const router = useRouter();
  const params = useParams();
  const { appointments, updateStatus } = useAppointmentStore();
  const appointment = appointments.find((a) => a.key === params.id);

  // useEffect(() => {
  //   // Redirect jika appointment tidak ditemukan atau status bukan Approved
  //   if (!appointment || appointment.status !== "Scheduled") {
  //     router.replace("/appointments/history");
  //   }
  // }, [appointment, router]);

  const handleComplete = () => {
    if (appointment) {
      updateStatus(appointment.key, "Completed");
      router.replace("/dashboard/appointments/history");
    }
  };

  if (!appointment) return <div>Loading...</div>;

  // Hitung umur
  const getAge = (dob?: string) => {
    if (!dob) return "-";
    const diff = new Date().getTime() - new Date(dob).getTime();
    return `${Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))} years`;
  };

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
                {appointment.patientName}
              </div>
              <div style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>
                {appointment.patientId}
              </div>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Gender</div>
                  <div style={{ fontWeight: 500 }}>{appointment.gender || "-"}</div>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Date of Birth</div>
                  <div style={{ fontWeight: 500 }}>{appointment.dob || "-"}</div>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 14 }}>Age</div>
                  <div style={{ fontWeight: 500 }}>{getAge(appointment.dob)}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: "right", marginTop: 12 }}>
            <Tag
              color={
                appointment.status === "Pending"
                  ? "#faad14"
                  : appointment.status === "Scheduled"
                  ? "#1677ff"
                  : appointment.status === "Rejected"
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
              <strong>Vaccine Name:</strong> <span style={{ marginLeft: 8 }}>{appointment.vaccineType}</span>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: 12 }}>
              <strong>Preferred Date:</strong> <span style={{ marginLeft: 8 }}>{appointment.preferredDate}</span>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: 12 }}>
              <strong>Preferred Time:</strong> <span style={{ marginLeft: 8 }}>{appointment.preferredTime}</span>
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
        {appointment.vaccinationHistory && appointment.vaccinationHistory.length > 0 ? (
          <Table
            dataSource={appointment.vaccinationHistory.map((v, idx) => ({ ...v, key: idx }))}
            pagination={false}
            size="small"
            columns={[
              { title: "Vaccine Name", dataIndex: "name", key: "name" },
              { title: "Date", dataIndex: "date", key: "date" },
              { title: "Dose", dataIndex: "dose", key: "dose" },
            ]}
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