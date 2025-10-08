import React from "react";
import ReactECharts from "echarts-for-react";
import type { GoalAnalysis } from "../utils/dataAnalysis";

interface GoalSectionProps {
	goalAnalysis: GoalAnalysis[];
}

const GoalSection: React.FC<GoalSectionProps> = ({ goalAnalysis }) => {
	// Calculate summary statistics
	const calculateSummary = (data: GoalAnalysis[], actualKey: "codingHours" | "studyHours" | "sportHours", goalKey: "codingGoal" | "studyGoal" | "sportGoal") => {
		const totalDays = data.length;
		const daysMetGoal = data.filter(day => day[actualKey] >= day[goalKey]).length;
		const totalActual = data.reduce((sum, day) => sum + day[actualKey], 0);
		const totalGoal = data.reduce((sum, day) => sum + day[goalKey], 0);
		const percentage = totalDays > 0 ? (daysMetGoal / totalDays) * 100 : 0;

		return {
			daysMetGoal,
			totalDays,
			percentage: percentage.toFixed(1),
			totalActual: totalActual.toFixed(1),
			totalGoal: totalGoal.toFixed(1)
		};
	};

	const codingSummary = calculateSummary(goalAnalysis, "codingHours", "codingGoal");
	const studySummary = calculateSummary(goalAnalysis, "studyHours", "studyGoal");
	const sportSummary = calculateSummary(goalAnalysis, "sportHours", "sportGoal");

	// Chart options for coding
	const codingChartOption = {
		tooltip: {
			trigger: "axis"
		},
		legend: {
			data: ["Actual", "Goal"],
			bottom: "0%"
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "10%",
			containLabel: true
		},
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: goalAnalysis.map(day => new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }))
		},
		yAxis: {
			type: "value",
			name: "Hours"
		},
		series: [
			{
				name: "Actual",
				type: "line",
				data: goalAnalysis.map(day => parseFloat(day.codingHours.toFixed(2))),
				smooth: true,
				lineStyle: {
					width: 3
				},
				color: "#667eea"
			},
			{
				name: "Goal",
				type: "line",
				data: goalAnalysis.map(day => day.codingGoal),
				lineStyle: {
					type: "dashed",
					width: 2
				},
				color: "#e0e0e0"
			}
		]
	};

	// Chart options for study
	const studyChartOption = {
		...codingChartOption,
		series: [
			{
				name: "Actual",
				type: "line",
				data: goalAnalysis.map(day => parseFloat(day.studyHours.toFixed(2))),
				smooth: true,
				lineStyle: {
					width: 3
				},
				color: "#10b981"
			},
			{
				name: "Goal",
				type: "line",
				data: goalAnalysis.map(day => day.studyGoal),
				lineStyle: {
					type: "dashed",
					width: 2
				},
				color: "#e0e0e0"
			}
		]
	};

	// Chart options for sport
	const sportChartOption = {
		...codingChartOption,
		series: [
			{
				name: "Actual",
				type: "line",
				data: goalAnalysis.map(day => parseFloat(day.sportHours.toFixed(2))),
				smooth: true,
				lineStyle: {
					width: 3
				},
				color: "#f59e0b"
			},
			{
				name: "Goal",
				type: "line",
				data: goalAnalysis.map(day => day.sportGoal),
				lineStyle: {
					type: "dashed",
					width: 2
				},
				color: "#e0e0e0"
			}
		]
	};

	return (
		<div className="space-y-6">
			{/* Goal Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Coding Goal */}
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-lg font-semibold text-primary-600">Coding Goal</h3>
						{parseFloat(codingSummary.percentage) >= 80 ? (
							<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						) : (
							<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						)}
					</div>

					<p className="text-sm text-gray-600 mb-4">Target: 2 hours/day</p>

					<div className="mb-4">
						<div className="flex justify-between text-sm mb-2">
							<span className="text-gray-600">
								{codingSummary.daysMetGoal} / {codingSummary.totalDays} days
							</span>
							<span className="font-semibold text-gray-900">{codingSummary.percentage}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${codingSummary.percentage}%` }}></div>
						</div>
					</div>

					<p className="text-sm text-gray-700">
						Total: {codingSummary.totalActual} hrs / {codingSummary.totalGoal} hrs goal
					</p>
				</div>

				{/* Study Goal */}
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-lg font-semibold text-green-600">Study Goal</h3>
						{parseFloat(studySummary.percentage) >= 80 ? (
							<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						) : (
							<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						)}
					</div>

					<p className="text-sm text-gray-600 mb-4">Target: 2 hours/day</p>

					<div className="mb-4">
						<div className="flex justify-between text-sm mb-2">
							<span className="text-gray-600">
								{studySummary.daysMetGoal} / {studySummary.totalDays} days
							</span>
							<span className="font-semibold text-gray-900">{studySummary.percentage}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${studySummary.percentage}%` }}></div>
						</div>
					</div>

					<p className="text-sm text-gray-700">
						Total: {studySummary.totalActual} hrs / {studySummary.totalGoal} hrs goal
					</p>
				</div>

				{/* Sport Goal */}
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-lg font-semibold text-yellow-600">Sport Goal</h3>
						{parseFloat(sportSummary.percentage) >= 80 ? (
							<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						) : (
							<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						)}
					</div>

					<p className="text-sm text-gray-600 mb-4">Target: 30 mins/day</p>

					<div className="mb-4">
						<div className="flex justify-between text-sm mb-2">
							<span className="text-gray-600">
								{sportSummary.daysMetGoal} / {sportSummary.totalDays} days
							</span>
							<span className="font-semibold text-gray-900">{sportSummary.percentage}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${sportSummary.percentage}%` }}></div>
						</div>
					</div>

					<p className="text-sm text-gray-700">
						Total: {sportSummary.totalActual} hrs / {sportSummary.totalGoal} hrs goal
					</p>
				</div>
			</div>

			{/* Charts */}
			{goalAnalysis.length > 0 && (
				<>
					{/* Coding Chart */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Coding: Goal vs Actual</h3>
						<ReactECharts option={codingChartOption} style={{ height: "300px" }} />
					</div>

					{/* Study Chart */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Study: Goal vs Actual</h3>
						<ReactECharts option={studyChartOption} style={{ height: "300px" }} />
					</div>

					{/* Sport Chart */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Sport: Goal vs Actual</h3>
						<ReactECharts option={sportChartOption} style={{ height: "300px" }} />
					</div>
				</>
			)}
		</div>
	);
};

export default GoalSection;
