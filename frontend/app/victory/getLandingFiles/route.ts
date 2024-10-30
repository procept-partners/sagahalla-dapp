import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Adjust the path to the 'landing' directory
    const landingPath = path.join(process.cwd(), 'app', 'victory', 'landing');
    console.log("Computed landing path:", landingPath);  // Logs the computed path

    // Check if the directory exists before attempting to read
    if (!fs.existsSync(landingPath)) {
      console.error('Landing directory does not exist:', landingPath);
      return NextResponse.json({ error: "Landing directory not found." }, { status: 404 });
    }

    // Attempt to read files in the directory
    const filenames = fs.readdirSync(landingPath).map(file => ({
      name: file.replace('.md', '').replace('_', ' '),
      path: `/landing/${file}`
    }));

    console.log("Files found in landing directory:", filenames);  // Logs the retrieved files
    return NextResponse.json(filenames);
  } catch (error) {
    console.error('Error accessing files in landing folder:', error);  // Log full error
    return NextResponse.json({ error: "Could not read files." }, { status: 500 });
  }
}
