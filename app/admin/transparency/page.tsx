"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createMeeting } from "@/lib/actions/createMeeting";
import { deleteMeeting } from "@/lib/actions/deleteMeeting";
import { getAttendance, getAttendanceByMeeting } from "@/lib/actions/getAttendance";
import { getMeetings } from "@/lib/actions/getMeetings";
import { upsertAttendance } from "@/lib/actions/upsertAttendance";
import { Button } from "@/primitives/Button";
import styles from "../statistics/page.module.css";

interface Meeting {
  id: number;
  meetingDate: string;
  meetingName: string;
}

interface AttendanceRecord {
  memberName: string;
  memberEmail: string;
  attendance: "absent" | "half_time" | "full_time";
  prepared: boolean;
  inPerson: boolean;
}

const BOARD_MEMBERS = [
  { name: "Zack Edwards", email: "zack@xogosgaming.com" },
  { name: "Michael Weaver", email: "enjoyweaver@gmail.com" },
  { name: "Braden Perry", email: "braden@kennyhertzperry.com" },
  { name: "Terrance Gatsby", email: "terrence@terrencegatsby.com" },
  { name: "Kevin Stursberg", email: "sturs49@gmail.com" },
  { name: "McKayla", email: "mckaylaareece@gmail.com" },
];

export default function AdminTransparencyPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingName, setNewMeetingName] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    if (selectedMeeting) {
      loadAttendance(selectedMeeting);
    }
  }, [selectedMeeting]);

  async function loadMeetings() {
    const result = await getMeetings();
    if (result.data) {
      setMeetings(result.data);
      if (result.data.length > 0 && !selectedMeeting) {
        setSelectedMeeting(result.data[0].id);
      }
    }
    setLoading(false);
  }

  async function loadAttendance(meetingId: number) {
    const result = await getAttendanceByMeeting(meetingId);
    const data: Record<string, AttendanceRecord> = {};

    BOARD_MEMBERS.forEach((member) => {
      data[member.email] = {
        memberName: member.name,
        memberEmail: member.email,
        attendance: "absent",
        prepared: false,
        inPerson: false,
      };
    });

    if (result.data) {
      result.data.forEach((record) => {
        data[record.memberEmail] = {
          memberName: record.memberName,
          memberEmail: record.memberEmail,
          attendance: record.attendance as "absent" | "half_time" | "full_time",
          prepared: record.prepared,
          inPerson: record.inPerson,
        };
      });
    }

    setAttendanceData(data);
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingDate || !newMeetingName) return;

    setSaving(true);
    const result = await createMeeting(newMeetingDate, newMeetingName);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Meeting created successfully!");
      setNewMeetingDate("");
      setNewMeetingName("");
      loadMeetings();
      if (result.data) {
        setSelectedMeeting(result.data.id);
      }
    }
    setSaving(false);
  };

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return;

    const confirmed = window.confirm("Are you sure you want to delete this meeting and all attendance records?");
    if (!confirmed) return;

    setSaving(true);
    const result = await deleteMeeting(selectedMeeting);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
    } else {
      setMessage("Meeting deleted successfully!");
      setSelectedMeeting(null);
      loadMeetings();
    }
    setSaving(false);
  };

  const updateAttendance = (email: string, field: string, value: any) => {
    setAttendanceData((prev) => ({
      ...prev,
      [email]: {
        ...prev[email],
        [field]: value,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedMeeting) return;

    setSaving(true);
    setMessage("");

    try {
      for (const email of Object.keys(attendanceData)) {
        const record = attendanceData[email];
        await upsertAttendance({
          meetingId: selectedMeeting,
          memberName: record.memberName,
          memberEmail: record.memberEmail,
          attendance: record.attendance,
          prepared: record.prepared,
          inPerson: record.inPerson,
        });
      }
      setMessage("Attendance saved successfully!");
    } catch (error) {
      setMessage("Error saving attendance");
    }

    setSaving(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/boardroom/transparency" className={styles.backLink}>
            ← Back to Transparency
          </Link>
          <h1 className={styles.title}>Admin: Board Transparency</h1>
        </div>
      </div>

      <div className={styles.content}>
        {/* Create New Meeting */}
        <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Create New Meeting</h2>
          <form onSubmit={handleCreateMeeting} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className={styles.field}>
              <label htmlFor="meetingDate" className={styles.label}>Date</label>
              <input
                id="meetingDate"
                type="date"
                value={newMeetingDate}
                onChange={(e) => setNewMeetingDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="meetingName" className={styles.label}>Meeting Name</label>
              <input
                id="meetingName"
                type="text"
                value={newMeetingName}
                onChange={(e) => setNewMeetingName(e.target.value)}
                className={styles.input}
                placeholder="e.g., Q1 2026 Board Meeting"
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              Create Meeting
            </Button>
          </form>
        </div>

        {/* Select Meeting */}
        {meetings.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div className={styles.field}>
              <label htmlFor="selectMeeting" className={styles.label}>Select Meeting to Edit</label>
              <select
                id="selectMeeting"
                value={selectedMeeting || ""}
                onChange={(e) => setSelectedMeeting(Number(e.target.value))}
                className={styles.input}
                style={{ maxWidth: "400px" }}
              >
                {meetings.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.meetingName} - {new Date(meeting.meetingDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDeleteMeeting}
              style={{
                marginTop: "0.5rem",
                padding: "8px 16px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "6px",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Delete This Meeting
            </button>
          </div>
        )}

        {/* Attendance Editor */}
        {selectedMeeting && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Edit Attendance</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Board Member</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Attendance</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Prepared</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>In-Person</th>
                  </tr>
                </thead>
                <tbody>
                  {BOARD_MEMBERS.map((member) => {
                    const record = attendanceData[member.email];
                    if (!record) return null;
                    return (
                      <tr key={member.email}>
                        <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {member.name}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <select
                            value={record.attendance}
                            onChange={(e) => updateAttendance(member.email, "attendance", e.target.value)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid rgba(255,255,255,0.2)",
                              background: "rgba(255,255,255,0.1)",
                              color: "#e5e5e5",
                            }}
                          >
                            <option value="absent">Absent</option>
                            <option value="half_time">Half Time</option>
                            <option value="full_time">Full Time</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <input
                            type="checkbox"
                            checked={record.prepared}
                            onChange={(e) => updateAttendance(member.email, "prepared", e.target.checked)}
                            style={{ width: "20px", height: "20px", cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <input
                            type="checkbox"
                            checked={record.inPerson}
                            onChange={(e) => updateAttendance(member.email, "inPerson", e.target.checked)}
                            style={{ width: "20px", height: "20px", cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Button onClick={handleSaveAttendance} disabled={saving}>
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        )}

        {message && (
          <p className={message.startsWith("Error") ? styles.errorMessage : styles.successMessage}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
