export interface CalendarEvent {
	id: string;
	summary: string;
	description?: string;
	start: {
		dateTime?: string;
		date?: string;
	};
	end: {
		dateTime?: string;
		date?: string;
	};
	calendarType: "Work" | "Class" | "Study";
}

export const initGoogleCalendarAPI = () => {
	return new Promise<void>((resolve, reject) => {
		// Check if script is already loaded
		if ((window as any).gapi) {
			(window as any).gapi.load("client", async () => {
				try {
					await (window as any).gapi.client.init({
						discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
					});
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			return;
		}

		const script = document.createElement("script");
		script.src = "https://apis.google.com/js/api.js";
		script.onload = () => {
			(window as any).gapi.load("client", async () => {
				try {
					await (window as any).gapi.client.init({
						discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
					});
					resolve();
				} catch (error) {
					reject(error);
				}
			});
		};
		script.onerror = reject;
		document.body.appendChild(script);
	});
};

export const fetchCalendarEvents = async (accessToken: string, calendarNames: string[], startDate: Date, endDate: Date): Promise<CalendarEvent[]> => {
	try {
		// Set the access token
		(window as any).gapi.client.setToken({ access_token: accessToken });

		// First, get all calendars
		const calendarListResponse = await (window as any).gapi.client.calendar.calendarList.list();
		const calendars = calendarListResponse.result.items;

		// Find calendars matching the names
		const targetCalendars = calendars.filter((cal: any) => calendarNames.some(name => cal.summary?.toLowerCase().includes(name.toLowerCase())));

		if (targetCalendars.length === 0) {
			console.warn("No matching calendars found for names:", calendarNames);
			return [];
		}

		// Fetch events from each calendar
		const allEvents: CalendarEvent[] = [];

		for (const calendar of targetCalendars) {
			try {
				const response = await (window as any).gapi.client.calendar.events.list({
					calendarId: calendar.id,
					timeMin: startDate.toISOString(),
					timeMax: endDate.toISOString(),
					showDeleted: false,
					singleEvents: true,
					orderBy: "startTime"
				});

				const events = response.result.items || [];

				// Determine calendar type
				let calendarType: "Work" | "Class" | "Study" = "Work";
				const summaryLower = calendar.summary.toLowerCase();
				if (summaryLower.includes("class")) {
					calendarType = "Class";
				} else if (summaryLower.includes("study")) {
					calendarType = "Study";
				}

				events.forEach((event: any) => {
					allEvents.push({
						id: event.id,
						summary: event.summary || "Untitled",
						description: event.description,
						start: event.start,
						end: event.end,
						calendarType
					});
				});
			} catch (error) {
				console.error(`Error fetching events from calendar ${calendar.summary}:`, error);
			}
		}

		return allEvents;
	} catch (error) {
		console.error("Error fetching calendar events:", error);
		throw error;
	}
};

export const getEventDuration = (event: CalendarEvent): number => {
	const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date || "");
	const end = event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date || "");

	const durationMs = end.getTime() - start.getTime();
	return durationMs / (1000 * 60 * 60); // Convert to hours
};

export const isWeekend = (event: CalendarEvent): boolean => {
	const date = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date || "");
	const dayOfWeek = date.getDay();
	return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

export const isFamilyDay = (event: CalendarEvent): boolean => {
	const summary = event.summary.toLowerCase();
	const description = event.description?.toLowerCase() || "";

	// Check if "Family" tag is in the event for the whole day
	return (summary.includes("family") || description.includes("family")) && !!event.start.date; // whole day event
};
