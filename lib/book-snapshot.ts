import type { Household } from "@/data/households";
import type { ScheduledMeeting } from "@/data/meetings";
import { PROJECT_TYPES, type Project } from "@/data/projects";
import type { Task } from "@/data/tasks";
import {
  TODAY,
  ageFrom,
  householdAum,
  nextReviewDue,
  nextTouchpointDue,
  reviewCadence,
  reviewStatus,
  touchpointStatus,
  weightedPipeline,
} from "@/lib/households";

type BookSource = {
  households: Household[];
  tasks: Task[];
  projects: Project[];
  upcomingMeetings: ScheduledMeeting[];
};

function householdSnapshot(household: Household) {
  return {
    id: household.id,
    name: household.name,
    type: household.type,
    tier: household.tier,
    tags: household.tags,
    leadAdvisor: household.advisor,
    clientSince: household.clientSince,
    pastClientSince: household.pastClientSince ?? null,
    estimatedAssets: household.estAssets ?? null,
    aum: householdAum(household),
    importantInformation: household.importantInfo ?? null,
    members: household.people.map((person) => ({
      name: `${person.firstName} ${person.lastName}`,
      role: person.role,
      age:
        person.dateOfBirth && person.role !== "Deceased"
          ? ageFrom(person.dateOfBirth)
          : null,
      dateOfBirth: person.dateOfBirth ?? null,
      maritalStatus: person.maritalStatus ?? null,
      occupation:
        [person.jobTitle, person.employer].filter(Boolean).join(", ") || null,
      retirementDate: person.retirementDate ?? null,
      email: person.email ?? null,
      phone: person.phone ?? null,
    })),
    accounts: household.accounts.map((account) => ({
      name: account.name,
      registration: account.registration,
      custodian: account.custodian,
      countsTowardAum: account.source === "custodian",
      balance: account.balance,
      ytdReturnPercent: account.ytdReturn,
    })),
    engagement: {
      reviewCadence:
        household.type === "Client" ? reviewCadence(household) : null,
      lastReview: household.lastReview,
      nextReviewDue: nextReviewDue(household),
      reviewStatus: reviewStatus(household),
      lastTouchpoint: household.lastTouchpoint,
      nextTouchpointDue: nextTouchpointDue(household),
      touchpointStatus: touchpointStatus(household),
    },
    opportunities: household.opportunities.map((opportunity) => ({
      name: opportunity.name,
      stage: opportunity.stage,
      value: opportunity.value,
      probabilityPercent: opportunity.probability,
      targetClose: opportunity.targetClose,
    })),
    weightedPipeline: weightedPipeline(household),
    recentMeetings: household.meetings.map((meeting) => ({
      title: meeting.title,
      type: meeting.type,
      date: meeting.date,
      advisor: meeting.advisor,
      summary: meeting.summary,
    })),
  };
}

export function buildBookSnapshot({
  households,
  tasks,
  projects,
  upcomingMeetings,
}: BookSource) {
  const nameOf = (id: string | null) =>
    households.find((household) => household.id === id)?.name ?? null;

  return {
    today: TODAY,
    households: households.map(householdSnapshot),
    openTasks: tasks
      .filter((task) => task.status === "todo")
      .map((task) => ({
        title: task.title,
        household: nameOf(task.householdId),
        assignee: task.assignee,
        due: task.due,
        priority: task.priority,
      })),
    activeProjects: projects
      .filter((project) => project.status === "in_progress")
      .map((project) => {
        const type = PROJECT_TYPES.find((item) => item.id === project.typeId);
        return {
          name: project.name,
          type: type?.name ?? project.typeId,
          household: nameOf(project.householdId),
          assignee: project.assignee,
          currentMilestone: type?.milestones[project.milestoneIndex] ?? null,
          dueDate: project.dueDate,
        };
      }),
    upcomingMeetings: upcomingMeetings.map((meeting) => ({
      title: meeting.title,
      type: meeting.type,
      household: nameOf(meeting.householdId),
      date: meeting.date,
      time: meeting.time,
      advisor: meeting.advisor,
      prepNotes: meeting.prep,
    })),
  };
}
