"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAttendance } from "@/lib/actions/getAttendance";
import { getMeetings } from "@/lib/actions/getMeetings";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";

interface Meeting {
  id: number;
  meetingDate: string;
  meetingName: string;
}

interface AttendanceRecord {
  id: number;
  meetingId: number;
  memberName: string;
  memberEmail: string;
  attendance: "absent" | "part_time" | "full_time";
  prepared: boolean;
  inPerson: boolean;
  meetingDate: string;
  meetingName: string;
}

const BOARD_MEMBERS = [
  { name: "Zack Edwards", email: "zack@xogosgaming.com" },
  { name: "Michael Weaver", email: "enjoyweaver@gmail.com" },
  { name: "Braden Perry", email: "braden@kennyhertzperry.com" },
  { name: "Terrance Gatsby", email: "terrence@terrencegatsby.com" },
  { name: "Kevin Stursberg", email: "sturs49@gmail.com" },
  { name: "McKayla", email: "mckaylaareece@gmail.com" },
];

export default function TransparencyPage() {
  const { data: session } = useSession();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.email === "zack@xogosgaming.com";

  useEffect(() => {
    async function loadData() {
      const [meetingsResult, attendanceResult] = await Promise.all([
        getMeetings(),
        getAttendance(),
      ]);

      if (meetingsResult.data) {
        setMeetings(meetingsResult.data);
      }
      if (attendanceResult.data) {
        setAttendance(attendanceResult.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const getAttendanceForMemberAndMeeting = (memberEmail: string, meetingId: number) => {
    return attendance.find(
      (a) => a.memberEmail === memberEmail && a.meetingId === meetingId
    );
  };

  const formatAttendance = (value: string) => {
    switch (value) {
      case "full_time":
        return "Full Time";
      case "part_time":
        return "Part Time";
      case "absent":
        return "Absent";
      default:
        return "-";
    }
  };

  const getAttendanceClass = (value: string) => {
    switch (value) {
      case "full_time":
        return styles.fullTime;
      case "part_time":
        return styles.partTime;
      case "absent":
        return styles.absent;
      default:
        return "";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.grid}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
        <div className={styles.glow}></div>
      </div>

      <Container className={styles.container}>
        <div className={styles.backLink}>
          <Link href="/boardroom">← Back to Board Room</Link>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Board Transparency</h1>
          <p className={styles.subtitle}>
            As per bylaws, we track attendance, preparation, and engagement
            for each board meeting to ensure accountability.
          </p>
        </div>

        {isAdmin && (
          <div className={styles.adminLink}>
            <Link href="/admin/transparency" className={styles.adminButton}>
              Edit Attendance Records
            </Link>
          </div>
        )}

        {loading ? (
          <p className={styles.loading}>Loading attendance records...</p>
        ) : meetings.length === 0 ? (
          <p className={styles.noData}>No meetings recorded yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.memberColumn}>Board Member</th>
                  {meetings.map((meeting) => (
                    <th key={meeting.id} className={styles.meetingHeader}>
                      <div className={styles.meetingName}>{meeting.meetingName}</div>
                      <div className={styles.meetingDate}>
                        {new Date(meeting.meetingDate).toLocaleDateString()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOARD_MEMBERS.map((member) => (
                  <tr key={member.email}>
                    <td className={styles.memberName}>{member.name}</td>
                    {meetings.map((meeting) => {
                      const record = getAttendanceForMemberAndMeeting(
                        member.email,
                        meeting.id
                      );
                      return (
                        <td key={meeting.id} className={styles.attendanceCell}>
                          {record ? (
                            <div className={styles.attendanceInfo}>
                              <span
                                className={`${styles.attendanceStatus} ${getAttendanceClass(record.attendance)}`}
                              >
                                {formatAttendance(record.attendance)}
                              </span>
                              <div className={styles.badges}>
                                {record.prepared && (
                                  <span className={styles.badge} title="Prepared with initiatives">
                                    📋
                                  </span>
                                )}
                                {record.inPerson && (
                                  <span className={styles.badge} title="Video was on">
                                    📹
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className={styles.noRecord}>-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.legend}>
          <h3 className={styles.legendTitle}>Legend</h3>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={`${styles.attendanceStatus} ${styles.fullTime}`}>Full Time</span>
              <span>Attended entire meeting</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.attendanceStatus} ${styles.partTime}`}>Part Time</span>
              <span>Attended part of meeting</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.attendanceStatus} ${styles.absent}`}>Absent</span>
              <span>Did not attend</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.badge}>📋</span>
              <span>Prepared (with initiatives)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.badge}>📹</span>
              <span>In-Person (video was on)</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
