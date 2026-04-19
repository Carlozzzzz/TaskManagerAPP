// src/services/moduleService.js
import apiClient from './apiClient';
import { modulePermissions } from '../constants/modulePermissions';

export const moduleService = {
    /**
     * Fetches all active modules from the database.
     */
    getAllModules: async () => {
        const response = await apiClient.get('/Modules');
        return response.data;
    },

    /**
     * SYNC LOGIC: 
     * Takes the nested 'modulePermissions' from your frontend constants 
     * and flattens it into a list of Module DTOs for the .NET Backend.
     */
    syncWithConfig: async () => {
        const modulesToSync = [];
        
        // Loop through the Categories (Maintenance, DevMode, etc.)
        Object.entries(modulePermissions).forEach(([category, config]) => {
            // Loop through the items inside each Category
            config.items.forEach(item => {
                modulesToSync.push({
                    key: item.moduleKey,      // Primary Key for Sync
                    displayName: item.name,   // Display Name in DB
                    section: category         // The Category Name (e.g. "Maintenance")
                });
            });
        });

        // POST the flat list to the Backend Sync endpoint
        const response = await apiClient.post('/Modules/sync', modulesToSync);
        return response.data;
    }
};