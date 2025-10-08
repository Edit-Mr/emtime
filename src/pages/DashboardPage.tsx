import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { CalendarEvent } from "../services/calendarService";
import { initGoogleCalendarAPI, fetchCalendarEvents, isWeekend, isFamilyDay } from "../services/calendarService";
import { analyzeEvents, analyzeGoals } from "../utils/dataAnalysis";
import type { AnalysisResult, GoalAnalysis } from "../utils/dataAnalysis";
import { detectSemester, formatDateRange } from "../utils/dateUtils";

import InsightSection from "../components/InsightSection";
import GoalSection from "../components/GoalSection";
import LogSection from "../components/LogSection";

const DashboardPage: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);

	// Date range state
	const defaultRange = detectSemester();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(23, 59, 59, 999);

	const [startDate, setStartDate] = useState<Date>(defaultRange.start);
	const [endDate, setEndDate] = useState<Date>(tomorrow);
	const [filterHolidays, setFilterHolidays] = useState(true);

	// Data state
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
	const [goalAnalysis, setGoalAnalysis] = useState<GoalAnalysis[]>([]);

	// Tab state
	const [currentTab, setCurrentTab] = useState<"insights" | "goals" | "log">("insights");

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user, navigate]);

	useEffect(() => {
		if (user) {
			loadCalendarData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (events.length > 0) {
			const analysisResult = analyzeEvents(events, filterHolidays);
			const filteredEventsForGoals = filterHolidays ? events.filter(e => !isWeekend(e) && !isFamilyDay(e)) : events;
			const goalResult = analyzeGoals(filteredEventsForGoals);

			setAnalysis(analysisResult);
			setGoalAnalysis(goalResult);
		}
	}, [events, filterHolidays]);

	const loadCalendarData = async () => {
		if (!user) return;

		setLoading(true);
		setError(null);

		try {
			await initGoogleCalendarAPI();
			const calendarEvents = await fetchCalendarEvents(user.accessToken, ["Work", "Life", "Study"], startDate, endDate);
			setEvents(calendarEvents);
		} catch (err) {
			console.error("Error loading calendar data:", err);
			setError("Failed to load calendar data. Please check your API key and try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleRefresh = () => {
		loadCalendarData();
	};

	const handleDateRangeSelect = (newStartDate: Date, newEndDate: Date) => {
		setStartDate(newStartDate);
		setEndDate(newEndDate);
		// Automatically refresh data with new date range
		setTimeout(() => {
			loadCalendarData();
		}, 100);
	};

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
								</svg>
							</div>
							<h1 className="text-xl font-bold text-gray-900">emtime</h1>
						</div>

						<div className="relative">
							<button onClick={() => setShowMenu(!showMenu)} className="flex items-center space-x-2 focus:outline-none">
								<img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
							</button>

							{showMenu && (
								<>
									<div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
									<div className="absolute right-0 mt-2 min-w-48 bg-white rounded-lg shadow-lg py-1 z-20">
										<div className="px-4 py-2 text-sm text-gray-500 border-b">{user.email}</div>
										<button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
												/>
											</svg>
											<span>Logout</span>
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
					</div>
				)}

				{/* Error State */}
				{error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{error}</div>}

				{/* Two Column Layout */}
				{!loading && events.length > 0 && analysis && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column - Controls, Summary, Pie Chart, Ranking */}
						<div className="lg:col-span-1 space-y-6">
							{/* Time Range Controls */}
							<div className="bg-white rounded-lg shadow p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Time Range</h2>

								<div className="space-y-4">
									<div className="flex gap-4 items-center">
										<DatePicker
											selected={startDate}
											onChange={date => date && setStartDate(date)}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
											dateFormat="MMM d, yyyy"
										/>
										<div className="text-sm font-medium text-gray-700">~</div>
										<DatePicker
											selected={endDate}
											onChange={date => date && setEndDate(date)}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
											dateFormat="MMM d, yyyy"
										/>
									</div>

									<div className="flex items-center">
										<label className="flex items-center cursor-pointer">
											<input
												type="checkbox"
												checked={filterHolidays}
												onChange={e => setFilterHolidays(e.target.checked)}
												className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
											/>
											<span className="ml-2 text-sm text-gray-700">Filter Holidays</span>
										</label>
									</div>

									<button
										onClick={handleRefresh}
										disabled={loading}
										className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
									>
										{loading ? "Loading..." : "Refresh Data"}
									</button>
								</div>

								<p className="text-xs text-gray-500 mt-3 hidden">Current range: {formatDateRange(startDate, endDate)}</p>
							</div>

							{/* Summary Cards - Flex Layout */}
							<div className="bg-white rounded-lg shadow p-6">
								<h3 className="text-sm font-medium text-gray-700 mb-3">Total Hours</h3>
								<div className="flex items-center justify-around gap-4 mb-4">
									<div className="text-center">
										<p className="text-3xl font-bold text-primary-600">{analysis.totalHours.Work.toFixed(1)}</p>
										<p className="text-xs text-gray-500 mt-1">Work</p>
									</div>
									<div className="text-center">
										<p className="text-3xl font-bold text-green-500">{analysis.totalHours.Study.toFixed(1)}</p>
										<p className="text-xs text-gray-500 mt-1">Study</p>
									</div>
									<div className="text-center">
										<p className="text-3xl font-bold text-yellow-500">{analysis.totalHours.Life.toFixed(1)}</p>
										<p className="text-xs text-gray-500 mt-1">Life</p>
									</div>
								</div>
								<div className="pt-3 border-t border-gray-200">
									<p className="text-center text-xl font-bold text-gray-900">{(analysis.totalHours.Work + analysis.totalHours.Study + analysis.totalHours.Life).toFixed(1)}</p>
									<p className="text-center text-xs text-gray-500 mt-1">Total</p>
								</div>
							</div>

							{/* Category Distribution Pie Chart */}
							<InsightSection analysis={analysis} viewMode="pieOnly" />

							{/* Category Ranking */}
							<InsightSection analysis={analysis} viewMode="rankingOnly" />
						</div>

						{/* Right Column - Tabs Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Tabs */}
							<div className="bg-white rounded-lg shadow">
								<div className="border-b border-gray-200">
									<nav className="flex space-x-8 px-6" aria-label="Tabs">
										<button
											onClick={() => setCurrentTab("insights")}
											className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
												currentTab === "insights" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}
										>
											Insights
										</button>
										<button
											onClick={() => setCurrentTab("goals")}
											className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
												currentTab === "goals" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}
										>
											Goals
										</button>
										<button
											onClick={() => setCurrentTab("log")}
											className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
												currentTab === "log" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}
										>
											Log
										</button>
									</nav>
								</div>
							</div>

							{/* Tab Content */}
							{currentTab === "insights" && <InsightSection analysis={analysis} />}
							{currentTab === "goals" && <GoalSection goalAnalysis={goalAnalysis} />}
							{currentTab === "log" && <LogSection analysis={analysis} />}
						</div>
					</div>
				)}

				{/* No Data State */}
				{!loading && events.length === 0 && !error && (
					<div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
						No events found in the selected date range. Try adjusting the date range or check your calendar names.
					</div>
				)}
			</main>
		</div>
	);
};

export default DashboardPage;
