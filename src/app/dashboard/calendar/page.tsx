'use client'
import React, { useEffect, useState } from 'react';
import { Calendar, Input, Button, Card, Typography, Row, Col } from 'antd';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import useAppointmentStore from '../../../../store/appointmentStore';
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// Helper: Convert "June 9, 2025" to YYYY-MM-DD
function toISODate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  // Pad month and day
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function VaccinationCalendar() {
  const { appointments } = useAppointmentStore();
  const router = useRouter();

  // State for search and calendar navigation
  const [search, setSearch] = useState('');
  const [currentDate, setCurrentDate] = useState<Dayjs | undefined>(undefined);

  // Filter appointments: only scheduled and match search
  const filteredAppointments = appointments.filter(apt =>
    apt.status?.toLowerCase() === 'scheduled' &&
    (
      apt.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      apt.vaccineType?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Calendar cell renderer
  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const listData = filteredAppointments.filter(item => {
      const isoDate = toISODate(item.preferredDate);
      return isoDate === dateStr;
    });

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        {listData.map(item => (
          <li key={item.key} style={{ marginBottom: '4px', cursor: 'pointer' }}>
            <div
              style={{
                backgroundColor: "#fffbe7",
                padding: '2px 4px',
                borderRadius: '2px',
                fontSize: '12px',
                border: "1px solid #e0e0e0"
              }}
              onClick={() => router.push(`/dashboard/appointments/${item.key}`)}
            >
              <div style={{ fontWeight: 500 }}>{item.patientName}</div>
              <div>{item.vaccineType} • {item.preferredTime}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Calendar navigation
  const handlePanelChange = (date: Dayjs) => {
    setCurrentDate(date);
  };

  // Custom header with month navigation
  const headerTitle = ({ value, onChange }: { value: Dayjs | undefined; onChange: (date: Dayjs) => void }) => {
    const safeValue = value || dayjs();
    const month = safeValue.format('MMMM YYYY');
    return (
      <div className="flex items-center justify-between w-full">
        <div>
          <Title level={4} style={{ margin: 0 }}>Vaccination Calendar</Title>
          <Text type="secondary">View and manage appointment schedule</Text>
        </div>
        <div className="flex items-center">
          <Button
            icon={<ChevronLeft size={16} />}
            type="text"
            aria-label="Previous month"
            onClick={() => onChange(safeValue.clone().subtract(1, 'month'))}
          />
          <span className="mx-4 font-medium">{month}</span>
          <Button
            icon={<ChevronRight size={16} />}
            type="text"
            aria-label="Next month"
            onClick={() => onChange(safeValue.clone().add(1, 'month'))}
          />
        </div>
      </div>
    );
  };

  return (
    <ClientOnly>
      <Card className="w-full">
        <div className="pt-0 px-4 pb-4 border-b border-gray-200">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} lg={16}>
              <Calendar
                value={currentDate}
                headerRender={({ value, onChange }) => headerTitle({ value, onChange })}
                fullscreen={false}
                style={{ display: "none" }}
              />
              {headerTitle({
                value: currentDate,
                onChange: setCurrentDate,
              })}
            </Col>
            <Col xs={24} lg={8}>
              <Input
                placeholder="Search appointments..."
                prefix={<Search size={16} />}
                className="w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </Col>
          </Row>
        </div>

        <Calendar
          value={currentDate}
          cellRender={dateCellRender}
          mode="month"
          onPanelChange={handlePanelChange}
          headerRender={() => null}
        />
      </Card>
    </ClientOnly>
  );
}
