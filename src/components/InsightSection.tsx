import React from "react";
import ReactECharts from "echarts-for-react";
import type { AnalysisResult } from "../utils/dataAnalysis";

interface InsightSectionProps {
	analysis: AnalysisResult;
	viewMode?: "full" | "pieOnly" | "rankingOnly";
}

const COLORS = {
	Work: "#667eea",
	Study: "#10b981",
	Life: "#f59e0b"
};

const InsightSection: React.FC<InsightSectionProps> = ({ analysis, viewMode = "full" }) => {
	const { totalHours, subcategoryHours, dailyBreakdown } = analysis;

	const totalSum = totalHours.Work + totalHours.Study + totalHours.Life;

	// Pie chart options
	const pieOption = {
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} hrs ({d}%)"
		},
		legend: {
			bottom: "0%",
			left: "center"
		},
		series: [
			{
				name: "Time Distribution",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#fff",
					borderWidth: 2
				},
				label: {
					show: true,
					formatter: "{b}: {d}%"
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 16,
						fontWeight: "bold"
					}
				},
				data: [
					{ value: parseFloat(totalHours.Work.toFixed(2)), name: "Work", itemStyle: { color: COLORS.Work } },
					{ value: parseFloat(totalHours.Study.toFixed(2)), name: "Study", itemStyle: { color: COLORS.Study } },
					{ value: parseFloat(totalHours.Life.toFixed(2)), name: "Life", itemStyle: { color: COLORS.Life } }
				]
			}
		]
	};

	// Area chart options for daily breakdown
	const areaOption = {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross"
			}
		},
		legend: {
			data: ["Work", "Study", "Life"],
			bottom: "12%"
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "20%",
			containLabel: true
		},
		dataZoom: [
			{
				type: "slider",
				show: true,
				xAxisIndex: [0],
				start: 0,
				end: 100,
				bottom: "2%",
				height: 20
			},
			{
				type: "inside",
				xAxisIndex: [0],
				start: 0,
				end: 100
			}
		],
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: dailyBreakdown.map(day => new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }))
		},
		yAxis: {
			type: "value",
			name: "Hours"
		},
		series: [
			{
				name: "Work",
				type: "line",
				stack: "Total",
				areaStyle: {},
				emphasis: {
					focus: "series"
				},
				data: dailyBreakdown.map(day => parseFloat(day.Work.toFixed(2))),
				color: COLORS.Work
			},
			{
				name: "Study",
				type: "line",
				stack: "Total",
				areaStyle: {},
				emphasis: {
					focus: "series"
				},
				data: dailyBreakdown.map(day => parseFloat(day.Study.toFixed(2))),
				color: COLORS.Study
			},
			{
				name: "Life",
				type: "line",
				stack: "Total",
				areaStyle: {},
				emphasis: {
					focus: "series"
				},
				data: dailyBreakdown.map(day => parseFloat(day.Life.toFixed(2))),
				color: COLORS.Life
			}
		]
	};

	// Get ranking data
	const getRanking = () => {
		return Object.entries(totalHours)
			.sort(([, a], [, b]) => b - a)
			.map(([category, hours], index) => ({
				rank: index + 1,
				category,
				hours: hours.toFixed(2),
				color: COLORS[category as keyof typeof COLORS]
			}));
	};

	// Get subcategory ranking
	const getSubcategoryRanking = (category: string) => {
		const subcats = subcategoryHours[category] || {};
		return (
			Object.entries(subcats)
				.sort(([, a], [, b]) => b - a)
				// .slice(0, 10)
				.map(([name, hours]) => ({
					name,
					hours: hours.toFixed(2)
				}))
		);
	};

	return (
		<div className="space-y-6">
			{/* Pie Chart Only View */}
			{viewMode === "pieOnly" && (
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
					<ReactECharts option={pieOption} style={{ height: "300px" }} />
				</div>
			)}

			{/* Ranking Only View */}
			{viewMode === "rankingOnly" && (
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Category Ranking</h3>
					<div className="space-y-3">
						{getRanking().map((item, index) => (
							<div key={item.category} className={index < getRanking().length - 1 ? "pb-3 border-b border-gray-200" : ""}>
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-2">
										<span className="text-lg font-semibold text-gray-700">#{item.rank}</span>
										<span className="text-lg font-medium" style={{ color: item.color }}>
											{item.category}
										</span>
									</div>
									<span className="text-lg font-bold text-gray-900">{item.hours} hrs</span>
								</div>
								<p className="text-sm text-gray-500 mt-1">{((parseFloat(item.hours) / totalSum) * 100).toFixed(1)}% of total time</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Full View - Daily Chart and Breakdowns */}
			{viewMode === "full" && (
				<>
					{/* Daily Time Distribution Chart */}
					{dailyBreakdown.length > 0 && (
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Time Distribution</h3>
							<ReactECharts option={areaOption} style={{ height: "450px" }} />
						</div>
					)}

					{/* Subcategory Rankings */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{["Work", "Study", "Life"].map(category => (
							<div key={category} className="bg-white rounded-lg shadow p-6">
								<h3 className="text-lg font-semibold mb-4" style={{ color: COLORS[category as keyof typeof COLORS] }}>
									{category} Breakdown
								</h3>
								<div className="space-y-2">
									{getSubcategoryRanking(category).map((item, index) => (
										<div key={item.name} className={index < getSubcategoryRanking(category).length - 1 ? "pb-2 border-b border-gray-100" : ""}>
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-700">{item.name}</span>
												<span className="text-sm font-semibold text-gray-900">{item.hours} hrs</span>
											</div>
										</div>
									))}
									{getSubcategoryRanking(category).length === 0 && <p className="text-sm text-gray-500">No events in this category</p>}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default InsightSection;
