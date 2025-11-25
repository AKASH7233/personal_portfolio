/**
 * LeetCode Submission Heatmap Component
 * Uses leetcode-calendar package for visualization
 */

import { useState, useEffect } from "react";
import { fetchFromAPI, API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface LeetCodeData {
  username: string;
  totalSolved: number;
  submissionCalendar: Record<string, number>;
}

export default function LeetCodeHeatmap() {
  const [leetCodeData, setLeetCodeData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeetCodeData() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchFromAPI(API_ENDPOINTS.LEETCODE_STATS);
        
        if (data && data.submissionCalendar) {
          setLeetCodeData(data);
        } else {
          throw new Error('No LeetCode submission data found');
        }
      } catch (err) {
        console.error('Error loading LeetCode data:', err);
        setError('Failed to load LeetCode submissions');
      } finally {
        setLoading(false);
      }
    }

    loadLeetCodeData();
  }, []);

  useEffect(() => {
    if (leetCodeData && leetCodeData.submissionCalendar) {
      // Dynamically import and initialize the leetcode-calendar
      import('leetcode-calendar').then((module) => {
        const calendarContainer = document.getElementById('leetcode-heatmap');
        if (calendarContainer && module.reactLeetCodeCalendar) {
          // Clear any existing content
          calendarContainer.innerHTML = '';
          
          // Initialize the calendar with the submission data
          const calendarData = leetCodeData.submissionCalendar;
          
          // Convert timestamp keys to submission calendar format if needed
          const formattedData = typeof calendarData === 'object' ? calendarData : {};
          
          // Create calendar HTML manually since the package might not support React directly
          const createCalendarHTML = () => {
            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            let html = '<div class="leetcode-calendar-container" style="font-family: monospace; color: #e5e7eb;">';
            html += '<div class="calendar-grid" style="display: flex; flex-wrap: wrap; gap: 2px; max-width: 100%;">';
            
            // Generate calendar squares
            for (let date = new Date(oneYearAgo); date <= today; date.setDate(date.getDate() + 1)) {
              const timestamp = Math.floor(date.getTime() / 1000);
              const submissions = formattedData[timestamp] || 0;
              
              // Color based on submission count
              let color = '#161b22'; // No submissions
              if (submissions > 0) {
                if (submissions >= 10) color = '#f97316'; // High (orange)
                else if (submissions >= 5) color = '#fb923c'; // Medium-high
                else if (submissions >= 2) color = '#fed7aa'; // Medium
                else color = '#ffedd5'; // Low
              }
              
              html += `<div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 2px; margin: 1px;" title="${submissions} submissions on ${date.toDateString()}"></div>`;
            }
            
            html += '</div></div>';
            return html;
          };
          
          calendarContainer.innerHTML = createCalendarHTML();
        }
      }).catch((err) => {
        console.error('Error loading leetcode-calendar:', err);
        
        // Fallback: create a simple custom visualization
        const calendarContainer = document.getElementById('leetcode-heatmap');
        if (calendarContainer && leetCodeData.submissionCalendar) {
          const createSimpleCalendar = () => {
            const submissions = leetCodeData.submissionCalendar;
            const today = new Date();
            const startDate = new Date();
            startDate.setDate(today.getDate() - 364);
            
            let html = '<div class="simple-calendar" style="display: flex; flex-wrap: wrap; gap: 2px; font-size: 12px; color: #e5e7eb;">';
            
            // Generate last 365 days
            for (let i = 0; i < 365; i++) {
              const currentDate = new Date(startDate);
              currentDate.setDate(startDate.getDate() + i);
              const timestamp = Math.floor(currentDate.getTime() / 1000);
              const count = submissions[timestamp] || 0;
              
              // LeetCode-style orange colors
              let bgColor = '#161b22';
              if (count > 0) {
                if (count >= 15) bgColor = '#f97316';
                else if (count >= 10) bgColor = '#fb923c';
                else if (count >= 5) bgColor = '#fdba74';
                else if (count >= 1) bgColor = '#fed7aa';
              }
              
              html += `<div style="width: 12px; height: 12px; background-color: ${bgColor}; border-radius: 2px; display: inline-block;" title="${count} submissions on ${currentDate.toDateString()}"></div>`;
            }
            
            html += '</div>';
            return html;
          };
          
          calendarContainer.innerHTML = createSimpleCalendar();
        }
      });
    }
  }, [leetCodeData]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">LeetCode Submissions</h3>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-xl font-semibold">LeetCode Submissions</h3>
        <div className="text-center text-gray-400">
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Calculate total submissions from calendar data
  const totalSubmissions = leetCodeData?.submissionCalendar 
    ? Object.values(leetCodeData.submissionCalendar).reduce((sum, count) => sum + (count || 0), 0)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">LeetCode Submissions</h3>
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-white">{totalSubmissions}</span> submissions in the past year
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-4 overflow-x-auto">
        <div 
          id="leetcode-heatmap" 
          className="min-h-[120px] w-full"
          style={{
            '--leetcode-calendar-background': 'transparent',
            '--leetcode-calendar-text': '#e5e7eb',
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
