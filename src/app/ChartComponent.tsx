"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import chartData from '../../data/chart-data.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
        {
            label: 'Sample Data',
            data: chartData.map((item) => item.value),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Sample Bar Chart',
        },
    },
};

export default function ChartComponent() {
    return <Bar data={data} options={options} />;
}
