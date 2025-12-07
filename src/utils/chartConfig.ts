/**
 * Chart.js configuration utilities
 * Applies design system colors and styling to charts
 */

import { colors } from 'spotify-design-system';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Get default chart options with design system styling
 */
export const getDefaultChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: colors.primary.white,
        font: {
          family: 'Circular Std, system-ui, sans-serif',
          size: 14,
        },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: colors.grey.grey6,
      titleColor: colors.primary.white,
      bodyColor: colors.grey.grey2,
      borderColor: colors.grey.grey4,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
});

/**
 * Radar chart options for audio features
 */
export const getRadarChartOptions = () => ({
  ...getDefaultChartOptions(),
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: colors.grey.grey2,
        backdropColor: 'transparent',
        font: {
          size: 12,
        },
        stepSize: 20,
      },
      grid: {
        color: colors.grey.grey4,
      },
      pointLabels: {
        color: colors.primary.white,
        font: {
          size: 13,
          weight: 'bold' as const,
        },
      },
    },
  },
  plugins: {
    ...getDefaultChartOptions().plugins,
    legend: {
      display: false,
    },
  },
});

/**
 * Donut chart options for genre distribution
 */
export const getDonutChartOptions = () => ({
  ...getDefaultChartOptions(),
  cutout: '70%',
  plugins: {
    ...getDefaultChartOptions().plugins,
    legend: {
      ...getDefaultChartOptions().plugins.legend,
      position: 'right' as const,
    },
  },
});

/**
 * Bar chart options for track comparisons
 */
export const getBarChartOptions = () => ({
  ...getDefaultChartOptions(),
  indexAxis: 'y' as const,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: colors.grey.grey2,
      },
      grid: {
        color: colors.grey.grey4,
      },
    },
    y: {
      ticks: {
        color: colors.primary.white,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    ...getDefaultChartOptions().plugins,
    legend: {
      display: false,
    },
  },
});

/**
 * Design system color palette for charts
 */
export const chartColors = {
  primary: colors.primary.brand,
  success: '#1ed760',
  warning: '#ffa500',
  error: '#ff4444',
  info: '#3b82f6',
  palette: [
    '#1ed760', // Spotify green
    '#1db954', // Darker green
    '#1aa34a', // Even darker
    '#179443', // Forest green
    '#14843c', // Deep green
    '#117535', // Emerald
    '#0e652e', // Hunter green
    '#0b5627', // Dark forest
  ],
};

