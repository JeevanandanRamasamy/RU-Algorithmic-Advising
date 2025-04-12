import React from "react";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const CoursePlanner = () => {
	return (
		<>
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<header className="flex justify-between items-center py-4 mb-8 border-b border-gray-300">
					<h1>Course Planner</h1>
				</header>

				<Tabs>
					<TabList>
						<Tab>Title 1</Tab>
						<Tab>Title 2</Tab>
					</TabList>

					<TabPanel>
						<h2>Any content 1</h2>
					</TabPanel>
					<TabPanel>
						<h2>Any content 2</h2>
					</TabPanel>
				</Tabs>
			</div>
		</>
	);
};

export default CoursePlanner;
