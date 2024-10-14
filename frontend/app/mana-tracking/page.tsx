// ManaTracking.tsx
import Navbar from "@/components/blocks/navbar";
import { promises as fs } from 'fs';
import DeveloperReport from './DeveloperReport'; // Import the new component

export default async function ManaTracking() {
    const file = await fs.readFile(process.cwd() + '/lib/output_reports/combined_report.json', 'utf8');
    const data = JSON.parse(file);

    // Extract all developer names from the data
    const devNames = Object.keys(data).filter(key => key !== 'totals');

    return (
        <>
            <Navbar />

            <div className="mana-tracking-page container mx-auto px-4 py-8">
                <h1 className="mb-4 text-4xl font-bold text-gray-800">Mana Tracking</h1>
                <p className="mb-6 text-lg text-gray-700">Welcome to our Mana Tracking page.</p>

                {/* Pass the data and devNames to the DeveloperReport component */}
                <DeveloperReport data={data} devNames={devNames} />

                <p className="text-lg text-gray-700">
                    Contact us at: <a href="mailto:support@sagamana.com" className="text-blue-500 hover:underline">support@sagamana.com</a>
                </p>
            </div>
        </>
    );
};