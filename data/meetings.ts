import type { MeetingType } from "@/data/households";

export type MeetingLocation = "Zoom" | "Office" | "Phone" | "Teams";

export type ScheduledMeeting = {
  id: string;
  householdId: string;
  title: string;
  type: MeetingType;
  date: string;
  time: string;
  durationMinutes: number;
  advisor: string;
  location: MeetingLocation;
  prep: string;
};

export const UPCOMING_MEETINGS: ScheduledMeeting[] = [
  {
    id: "um1",
    householdId: "feldman",
    title: "Rollover transfer-out follow-up",
    type: "Client check-in",
    date: "2026-10-05",
    time: "09:30",
    durationMinutes: 30,
    advisor: "Priya Raman",
    location: "Phone",
    prep: "Schwab flagged the Rollover IRA •••• 4410 as transferred out on Oct 4. Confirm whether the Feldmans initiated it, and whether it relates to the Northfield 401(k) rollover project. Review is also 19 days overdue; offer to book it on this call.",
  },
  {
    id: "um2",
    householdId: "bishop",
    title: "Proposal decision call",
    type: "Prospect",
    date: "2026-10-06",
    time: "14:00",
    durationMinutes: 45,
    advisor: "Priya Raman",
    location: "Zoom",
    prep: "Qualified at 60%, $2.6M expected. They were waiting on statements from their current broker. Bring the fee schedule and the transfer checklist; aim to close and start onboarding.",
  },
  {
    id: "um3",
    householdId: "shah",
    title: "Practice sale discovery",
    type: "Prospect",
    date: "2026-10-07",
    time: "11:00",
    durationMinutes: 60,
    advisor: "Marcus Bell",
    location: "Office",
    prep: "Dental group owner exploring a practice sale (~$6M opportunity). Divorced, no planner today. Ask about sale timeline, deal structure, and whether she has a CPA and estate attorney.",
  },
  {
    id: "um4",
    householdId: "hartwell",
    title: "RMD and gifting check-in",
    type: "Client check-in",
    date: "2026-10-08",
    time: "10:00",
    durationMinutes: 30,
    advisor: "Dana Whitfield",
    location: "Phone",
    prep: "RMD project is past due (target Oct 1). Confirm the distribution amount and account. Eleanor wants to gift appreciated shares to a donor-advised fund ($500K opportunity in Reviewing).",
  },
  {
    id: "um5",
    householdId: "morales",
    title: "Annual review",
    type: "Client review",
    date: "2026-10-13",
    time: "16:00",
    durationMinutes: 60,
    advisor: "Priya Raman",
    location: "Zoom",
    prep: "Review is 33 days overdue; last touchpoint May 19. Helen wanted to revisit long-term care insurance. Revisit savings rate (raised to 15% last year).",
  },
  {
    id: "um6",
    householdId: "reyes",
    title: "Quarterly review and LOI planning",
    type: "Client review",
    date: "2026-10-15",
    time: "13:00",
    durationMinutes: 90,
    advisor: "Marcus Bell",
    location: "Office",
    prep: "LOI for Reyes Logistics landed early. Walk through after-tax proceeds model, pre-sale gifting to the family trust, and 529 funding for Mateo and Lucia. CPA joining.",
  },
  {
    id: "um7",
    householdId: "sullivan",
    title: "Annual review",
    type: "Client review",
    date: "2026-10-19",
    time: "18:00",
    durationMinutes: 45,
    advisor: "Owen Calloway",
    location: "Zoom",
    prep: "Check PSLF progress and student loan plan. Increase 529 contributions for Nora; update 529 schedule task is still open.",
  },
  {
    id: "um8",
    householdId: "thornton",
    title: "Proposal presentation",
    type: "Prospect",
    date: "2026-10-21",
    time: "15:00",
    durationMinutes: 60,
    advisor: "Dana Whitfield",
    location: "Office",
    prep: "Referred by the Hartwells. $3.2M across four accounts; wants a second opinion on retirement timing. Bring retirement timing scenarios and the transfer plan.",
  },
];
