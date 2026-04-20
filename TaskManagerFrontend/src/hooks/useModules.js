import { moduleService } from "../services/moduleService";
import { useLoading } from "./useLoading";
import { useRoles } from "./useRoles";
import { useToast } from "./useToast";

export function useModules() {
	const { fetchRolesAndModules } = useRoles();
	const { loading, showLoading, hideLoading } = useLoading();
	const { showToast } = useToast();

	const syncModules = async () => {
		showLoading();
		try {
			await moduleService.syncWithConfig();
			showToast("Modules synced with database successfully", "success");

			await fetchRolesAndModules();
		} catch (err) {
			showToast("Error saving role", "error");
			console.error("Error: ", err)
		} finally {
			hideLoading();
		}
	};

	return {
		loading,
		syncModules,
	};
}