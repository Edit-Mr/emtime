import type { CalendarEvent } from "../services/calendarService";
import { getEventDuration, isWeekend, isFamilyDay } from "../services/calendarService";

export interface CategoryMapping {
	Work: string[];
	Study: string[];
	Life: string[];
}

export const categoryMapping: CategoryMapping = {
	Work: ["SITCON", "SDC", "COSCUP", "emtech", "Coding", "justfont", "justwriteNOW", "Debate", "Core System", "Bamboofox"],
	Study: [],
	Life: ["Gym","Swimming"]
};

export interface AnalysisResult {
	totalHours: {
		Work: number;
		Study: number;
		Life: number;
	};
	subcategoryHours: {
		[category: string]: {
			[subcategory: string]: number;
		};
	};
	dailyBreakdown: {
		date: string;
		Work: number;
		Study: number;
		Life: number;
	}[];
	eventsByCategory: {
		Work: CalendarEvent[];
		Study: CalendarEvent[];
		Life: CalendarEvent[];
	};
}

export const categorizeEvent = (event: CalendarEvent): string => {
	// Category is determined by the calendar name (already set as calendarType in the service)
	// Calendar names: "Work" calendars → Work, "Class"/"Study" calendars → Study, "Life" calendars → Life
	return event.calendarType;
};

export const getSubcategory = (event: CalendarEvent, category: string): string => {
	const summaryLower = event.summary.toLowerCase();
	const subcategories = categoryMapping[category as keyof CategoryMapping] || [];

	for (const subcategory of subcategories) {
		if (summaryLower.includes(subcategory.toLowerCase())) {
			return subcategory;
		}
	}

	// Return the event name as subcategory if no match found
	return event.summary;
};

export const filterHolidays = (events: CalendarEvent[]): CalendarEvent[] => {
	return events.filter(event => {
		return !isWeekend(event) && !isFamilyDay(event);
	});
};

export const analyzeEvents = (events: CalendarEvent[], filterHolidaysEnabled: boolean): AnalysisResult => {
	const filteredEvents = filterHolidaysEnabled ? filterHolidays(events) : events;

	const totalHours = {
		Work: 0,
		Study: 0,
		Life: 0
	};

	const subcategoryHours: { [category: string]: { [subcategory: string]: number } } = {
		Work: {},
		Study: {},
		Life: {}
	};

	const eventsByCategory = {
		Work: [] as CalendarEvent[],
		Study: [] as CalendarEvent[],
		Life: [] as CalendarEvent[]
	};

	const dailyHoursMap = new Map<string, { Work: number; Study: number; Life: number }>();

	filteredEvents.forEach(event => {
		const category = categorizeEvent(event);
		const duration = getEventDuration(event);
		const subcategory = getSubcategory(event, category);

		// Add to total hours
		totalHours[category as keyof typeof totalHours] += duration;

		// Add to subcategory hours
		if (!subcategoryHours[category][subcategory]) {
			subcategoryHours[category][subcategory] = 0;
		}
		subcategoryHours[category][subcategory] += duration;

		// Add to events by category
		eventsByCategory[category as keyof typeof eventsByCategory].push(event);

		// Add to daily breakdown
		const dateStr = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split("T")[0] : event.start.date || "";

		if (!dailyHoursMap.has(dateStr)) {
			dailyHoursMap.set(dateStr, { Work: 0, Study: 0, Life: 0 });
		}

		const dailyData = dailyHoursMap.get(dateStr)!;
		dailyData[category as keyof typeof dailyData] += duration;
	});

	// Convert daily breakdown to array and sort by date
	const dailyBreakdown = Array.from(dailyHoursMap.entries())
		.map(([date, hours]) => ({
			date,
			...hours
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	return {
		totalHours,
		subcategoryHours,
		dailyBreakdown,
		eventsByCategory
	};
};

export interface GoalAnalysis {
	date: string;
	codingHours: number;
	studyHours: number;
	sportHours: number;
	codingGoal: number;
	studyGoal: number;
	sportGoal: number;
}

export const analyzeGoals = (events: CalendarEvent[]): GoalAnalysis[] => {
	const dailyGoals = new Map<string, { coding: number; study: number; sport: number }>();

	events.forEach(event => {
		const dateStr = event.start.dateTime ? new Date(event.start.dateTime).toISOString().split("T")[0] : event.start.date || "";

		if (!dailyGoals.has(dateStr)) {
			dailyGoals.set(dateStr, { coding: 0, study: 0, sport: 0 });
		}

		const dailyData = dailyGoals.get(dateStr)!;
		const duration = getEventDuration(event);
		const summaryLower = event.summary.toLowerCase();

		// Check for coding (2 hours goal)
		if (summaryLower.includes("coding")) {
			dailyData.coding += duration;
		}

		// Check for study (2 hours goal)
		const category = categorizeEvent(event);
		if (category === "Study") {
			dailyData.study += duration;
		}

		// Check for sport (30 mins = 0.5 hours goal)
        const sportKeywords = ["gym", "sport", "exercise", "swimming"];
		if (sportKeywords.some(keyword => summaryLower.includes(keyword))) {
			dailyData.sport += duration;
		}
	});

	return Array.from(dailyGoals.entries())
		.map(([date, hours]) => ({
			date,
			codingHours: hours.coding,
			studyHours: hours.study,
			sportHours: hours.sport,
			codingGoal: 2,
			studyGoal: 2,
			sportGoal: 0.5
		}))
		.sort((a, b) => a.date.localeCompare(b.date));
};
