import React, { useState } from "react";
import type { AnalysisResult } from "../utils/dataAnalysis";
import type { CalendarEvent } from "../services/calendarService";
import { getEventDuration } from "../services/calendarService";
import { getSubcategory } from "../utils/dataAnalysis";

interface LogSectionProps {
	analysis: AnalysisResult;
}

const CATEGORY_COLORS = {
	Work: "#667eea",
	Study: "#10b981",
	Life: "#f59e0b"
};

const LogSection: React.FC<LogSectionProps> = ({ analysis }) => {
	const { eventsByCategory } = analysis;
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
	const [expandedSubcategory, setExpandedSubcategory] = useState<{ [key: string]: boolean }>({});
	const [expandedEvent, setExpandedEvent] = useState<{ [key: string]: boolean }>({});

	// Group events by subcategory
	const groupEventsBySubcategory = (events: CalendarEvent[], category: string) => {
		const grouped: { [key: string]: CalendarEvent[] } = {};

		events.forEach(event => {
			const subcategory = getSubcategory(event, category);
			if (!grouped[subcategory]) {
				grouped[subcategory] = [];
			}
			grouped[subcategory].push(event);
		});

		return grouped;
	};

	const formatDateTime = (event: CalendarEvent) => {
		if (event.start.dateTime) {
			const start = new Date(event.start.dateTime);
			const end = new Date(event.end.dateTime || event.start.dateTime);
			return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
		} else {
			return `All day: ${new Date(event.start.date || "").toLocaleDateString()}`;
		}
	};

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Event Log</h2>

			{/* Category Level */}
			{(["Work", "Study", "Life"] as const).map(category => {
				const events = eventsByCategory[category];
				const subcategories = groupEventsBySubcategory(events, category);
				const totalHours = events.reduce((sum, event) => sum + getEventDuration(event), 0);
				const isExpanded = expandedCategory === category;

				return (
					<div key={category} className="bg-white rounded-lg shadow overflow-hidden">
						{/* Category Header */}
						<button
							onClick={() => setExpandedCategory(isExpanded ? null : category)}
							className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
							style={{ backgroundColor: `${CATEGORY_COLORS[category]}10` }}
						>
							<div className="flex items-center space-x-4">
								<div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: CATEGORY_COLORS[category] }}>
									{category === "Work" && (
										<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									)}
									{category === "Study" && (
										<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									)}
									{category === "Life" && (
										<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											/>
										</svg>
									)}
								</div>
								<h3 className="text-xl font-semibold text-gray-900">{category}</h3>
							</div>
							<div className="flex items-center space-x-4">
								<span className="px-3 py-1 text-sm font-medium rounded-full text-white" style={{ backgroundColor: CATEGORY_COLORS[category] }}>
									{events.length} events
								</span>
								<span className="px-3 py-1 text-sm font-medium rounded-full border-2" style={{ borderColor: CATEGORY_COLORS[category], color: CATEGORY_COLORS[category] }}>
									{totalHours.toFixed(1)} hrs
								</span>
								<svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</button>

						{/* Category Content */}
						{isExpanded && (
							<div className="px-6 py-4 space-y-4">
								{Object.entries(subcategories).map(([subcategory, subcatEvents]) => {
									const subcatHours = subcatEvents.reduce((sum, event) => sum + getEventDuration(event), 0);
									const subcatKey = `${category}-${subcategory}`;
									const isSubcatExpanded = expandedSubcategory[subcatKey];

									return (
										<div key={subcategory} className="border border-gray-200 rounded-lg overflow-hidden">
											{/* Subcategory Header */}
											<button
												onClick={() => setExpandedSubcategory(prev => ({ ...prev, [subcatKey]: !prev[subcatKey] }))}
												className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
											>
												<h4 className="font-medium text-gray-900">{subcategory}</h4>
												<div className="flex items-center space-x-3">
													<span className="text-sm text-gray-600">{subcatEvents.length} events</span>
													<span className="text-sm font-semibold text-gray-900">{subcatHours.toFixed(1)} hrs</span>
													<svg
														className={`w-4 h-4 text-gray-500 transition-transform ${isSubcatExpanded ? "transform rotate-180" : ""}`}
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
													</svg>
												</div>
											</button>

											{/* Events List */}
											{isSubcatExpanded && (
												<div className="divide-y divide-gray-100">
													{subcatEvents.map(event => {
														const eventKey = event.id;
														const isEventExpanded = expandedEvent[eventKey];

														return (
															<div key={event.id}>
																<button
																	onClick={() => setExpandedEvent(prev => ({ ...prev, [eventKey]: !prev[eventKey] }))}
																	className="w-full px-4 py-2 hover:bg-gray-50 flex items-center justify-between transition-colors text-left"
																>
																	<span className="text-sm text-gray-700">{event.summary}</span>
																	<div className="flex items-center space-x-2">
																		<span className="text-xs text-gray-500">{getEventDuration(event).toFixed(2)} hrs</span>
																		<svg
																			className={`w-4 h-4 text-gray-400 transition-transform ${isEventExpanded ? "transform rotate-180" : ""}`}
																			fill="none"
																			stroke="currentColor"
																			viewBox="0 0 24 24"
																		>
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
																		</svg>
																	</div>
																</button>

																{/* Event Details */}
																{isEventExpanded && (
																	<div className="px-4 py-3 bg-gray-50 text-sm space-y-2">
																		<div>
																			<span className="font-medium text-gray-700">Time:</span> <span className="text-gray-600">{formatDateTime(event)}</span>
																		</div>
																		<div>
																			<span className="font-medium text-gray-700">Duration:</span>{" "}
																			<span className="text-gray-600">{getEventDuration(event).toFixed(2)} hours</span>
																		</div>
																		<div>
																			<span className="font-medium text-gray-700">Calendar:</span> <span className="text-gray-600">{event.calendarType}</span>
																		</div>
																		{event.description && (
																			<div>
																				<span className="font-medium text-gray-700">Description:</span>{" "}
																				<span className="text-gray-600">{event.description}</span>
																			</div>
																		)}
																	</div>
																)}
															</div>
														);
													})}
												</div>
											)}
										</div>
									);
								})}

								{Object.keys(subcategories).length === 0 && <p className="text-sm text-gray-500 text-center py-4">No events in this category</p>}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default LogSection;
