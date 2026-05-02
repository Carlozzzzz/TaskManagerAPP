import { useCallback, useState } from "react";
import { moduleService } from "../services/moduleService";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export function useModules() {
	const [modules, setModules] = useState(null);
	const { loading, showLoading, hideLoading } = useLoading();
	const { showToast } = useToast();

	const fetchModules = useCallback(async () => {
		showLoading();
		try {
			const modulesData = await moduleService.getAllModules();
			setModules(modulesData);
		} catch (err) {
			console.error("Error: ", err)
			showToast("Error fetching modules", "error")
		} finally {
			hideLoading();
		}
	}, [showLoading, hideLoading, showToast]);

	const syncModules = async () => {
		showLoading();
		try {
			await moduleService.syncWithConfig();
			showToast("Modules synced with database successfully", "success");

			await fetchModules();
		} catch (err) {
			showToast("Error saving role", "error");
			console.error("Error: ", err)
		} finally {
			hideLoading();
		}
	};

	return {
		modules,
		loading,
		fetchModules,
		syncModules,
	};
}