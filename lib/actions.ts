'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import type { ActionResult, AnalysisData } from './types';
import type { RehearsalSlot, AvailabilitySubmission } from '@prisma/client';

export async function createRehearsalSlot(data: {
  date: Date;
  startTime: string;
  durationMinutes: number;
}): Promise<ActionResult<RehearsalSlot>> {
  try {
    if (!data.date || !data.startTime || !data.durationMinutes) {
      return { success: false, error: 'All fields are required' };
    }

    if (data.durationMinutes < 15 || data.durationMinutes > 480) {
      return { success: false, error: 'Duration must be between 15 and 480 minutes' };
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.startTime)) {
      return { success: false, error: 'Invalid time format. Use HH:MM' };
    }

    const slot = await prisma.rehearsalSlot.create({
      data: {
        date: data.date,
        startTime: data.startTime,
        durationMinutes: data.durationMinutes,
      },
    });

    revalidatePath('/config');
    revalidatePath('/');
    revalidatePath('/analysis');

    return { success: true, data: slot };
  } catch (error) {
    console.error('Error creating rehearsal slot:', error);
    return { success: false, error: 'Failed to create rehearsal slot' };
  }
}

export async function createRehearsalSlots(data: {
  dates: Date[];
  startTimes: string[];
  durationMinutes: number;
}): Promise<ActionResult<number>> {
  try {
    if (!data.dates || data.dates.length === 0 || !data.startTimes || data.startTimes.length === 0) {
      return { success: false, error: 'At least one date and one time are required' };
    }

    if (data.durationMinutes < 15 || data.durationMinutes > 480) {
      return { success: false, error: 'Duration must be between 15 and 480 minutes' };
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const time of data.startTimes) {
      if (!timeRegex.test(time)) {
        return { success: false, error: 'Invalid time format. Use HH:MM' };
      }
    }

    // Create all combinations of dates and times
    // Normalize dates to noon UTC to avoid timezone boundary issues
    const slotsToCreate = [];
    for (const date of data.dates) {
      // Ensure date is at noon UTC to avoid day boundary issues
      const normalizedDate = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        12, 0, 0
      ));
      for (const startTime of data.startTimes) {
        slotsToCreate.push({
          date: normalizedDate,
          startTime,
          durationMinutes: data.durationMinutes,
        });
      }
    }

    const result = await prisma.rehearsalSlot.createMany({
      data: slotsToCreate,
    });

    revalidatePath('/config');
    revalidatePath('/');
    revalidatePath('/analysis');

    return { success: true, data: result.count };
  } catch (error) {
    console.error('Error creating rehearsal slots:', error);
    return { success: false, error: 'Failed to create rehearsal slots' };
  }
}

export async function deleteRehearsalSlot(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.rehearsalSlot.delete({
      where: { id },
    });

    revalidatePath('/config');
    revalidatePath('/');
    revalidatePath('/analysis');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting rehearsal slot:', error);
    return { success: false, error: 'Failed to delete rehearsal slot' };
  }
}

export async function getRehearsalSlots(): Promise<RehearsalSlot[]> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return [];
    }
    
    const slots = await prisma.rehearsalSlot.findMany({
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
    return slots;
  } catch (error) {
    console.error('Error fetching rehearsal slots:', error);
    return [];
  }
}

export async function deleteAllRehearsalSlots(): Promise<ActionResult<void>> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return { success: true, data: undefined };
    }
    
    await prisma.rehearsalSlot.deleteMany({});

    revalidatePath('/config');
    revalidatePath('/');
    revalidatePath('/analysis');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting all rehearsal slots:', error);
    return { success: false, error: 'Failed to delete all rehearsal slots' };
  }
}

export async function deleteAllSubmissions(): Promise<ActionResult<number>> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return { success: true, data: 0 };
    }
    
    // Delete all selections first (cascade will handle this, but being explicit)
    await prisma.availabilitySelection.deleteMany({});
    
    // Delete all submissions
    const result = await prisma.availabilitySubmission.deleteMany({});

    revalidatePath('/analysis');

    return { success: true, data: result.count };
  } catch (error) {
    console.error('Error deleting all submissions:', error);
    return { success: false, error: 'Failed to delete all submissions' };
  }
}

export async function deleteSubmission(id: string): Promise<ActionResult<void>> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return { success: true, data: undefined };
    }
    
    await prisma.availabilitySubmission.delete({
      where: { id },
    });

    revalidatePath('/analysis');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { success: false, error: 'Failed to delete submission' };
  }
}

export async function getSubmissionsList(): Promise<Array<{ id: string; participantName: string; createdAt: Date; selectionCount: number; selections: Array<{ slotId: string }> }>> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return [];
    }
    
    const submissions = await prisma.availabilitySubmission.findMany({
      include: {
        selections: {
          select: { slotId: true },
        },
        _count: {
          select: { selections: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return submissions.map(sub => ({
      id: sub.id,
      participantName: sub.participantName,
      createdAt: sub.createdAt,
      selectionCount: sub._count.selections,
      selections: sub.selections,
    }));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

export async function submitAvailability(data: {
  participantName: string;
  slotIds: string[];
}): Promise<ActionResult<AvailabilitySubmission>> {
  try {
    const trimmedName = data.participantName.trim();

    if (!trimmedName || trimmedName.length === 0) {
      return { success: false, error: 'Name is required' };
    }

    if (trimmedName.length > 100) {
      return { success: false, error: 'Name must be 100 characters or less' };
    }

    if (!data.slotIds || data.slotIds.length === 0) {
      return { success: false, error: 'Please select at least one rehearsal slot' };
    }

    const submission = await prisma.availabilitySubmission.create({
      data: {
        participantName: trimmedName,
        selections: {
          create: data.slotIds.map((slotId) => ({
            slotId,
          })),
        },
      },
      include: {
        selections: true,
      },
    });

    revalidatePath('/analysis');

    return { success: true, data: submission };
  } catch (error) {
    console.error('Error submitting availability:', error);
    return { success: false, error: 'Failed to submit availability' };
  }
}

export async function getAnalysisData(): Promise<AnalysisData> {
  try {
    // Check if database is available (for build-time)
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://placeholder') {
      return {
        slots: [],
        totalSubmissions: 0,
      };
    }
    
    const [slots, totalSubmissions] = await Promise.all([
      prisma.rehearsalSlot.findMany({
        include: {
          selections: {
            include: {
              submission: true,
            },
          },
        },
        orderBy: [
          { date: 'asc' },
          { startTime: 'asc' },
        ],
      }),
      prisma.availabilitySubmission.count(),
    ]);

    const analysisSlots = slots.map((slot) => {
      const attendees = slot.selections.map((s) => s.submission.participantName);
      const attendeeCount = attendees.length;
      const attendanceRate = totalSubmissions > 0 
        ? Math.round((attendeeCount / totalSubmissions) * 100) 
        : 0;

      return {
        slot: {
          id: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          durationMinutes: slot.durationMinutes,
          createdAt: slot.createdAt,
        },
        attendeeCount,
        attendees: attendees.sort(),
        attendanceRate,
      };
    });

    analysisSlots.sort((a, b) => {
      if (b.attendeeCount !== a.attendeeCount) {
        return b.attendeeCount - a.attendeeCount;
      }
      return a.slot.date.getTime() - b.slot.date.getTime();
    });

    return {
      slots: analysisSlots,
      totalSubmissions,
    };
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    return {
      slots: [],
      totalSubmissions: 0,
    };
  }
}
