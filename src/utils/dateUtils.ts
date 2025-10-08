export interface DateRange {
	start: Date;
	end: Date;
	label: string;
}

export const detectSemester = (currentDate: Date = new Date()): DateRange => {
	const month = currentDate.getMonth() + 1; // 1-12
	const year = currentDate.getFullYear();

	if (month >= 9 || month <= 1) {
		// Fall semester: September to January
		const startYear = month >= 9 ? year : year - 1;
		return {
			start: new Date(startYear, 8, 1), // September 1
			end: new Date(startYear + 1, 0, 31, 23, 59, 59), // January 31
			label: `Fall ${startYear}`
		};
	} else if (month >= 2 && month <= 6) {
		// Spring semester: February to June
		return {
			start: new Date(year, 1, 1), // February 1
			end: new Date(year, 5, 30, 23, 59, 59), // June 30
			label: `Spring ${year}`
		};
	} else {
		// Summer: July to August
		return {
			start: new Date(year, 6, 1), // July 1
			end: new Date(year, 7, 31, 23, 59, 59), // August 31
			label: `Summer ${year}`
		};
	}
};

export const formatDateRange = (start: Date, end: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric"
	};
	return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
};
