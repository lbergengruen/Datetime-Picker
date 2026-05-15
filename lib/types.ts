import { RehearsalSlot, AvailabilitySubmission, AvailabilitySelection } from '@prisma/client';

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export type RehearsalSlotWithSelections = RehearsalSlot & {
  selections: (AvailabilitySelection & {
    submission: AvailabilitySubmission;
  })[];
};

export type AnalysisSlot = {
  slot: RehearsalSlot;
  attendeeCount: number;
  attendees: string[];
  attendanceRate: number;
};

export type AnalysisData = {
  slots: AnalysisSlot[];
  totalSubmissions: number;
};
