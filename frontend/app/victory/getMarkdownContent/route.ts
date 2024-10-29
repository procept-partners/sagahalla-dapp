import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filename = url.searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required.' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'app', 'victory', 'landing', `${filename}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const processedContent = await remark().use(html).process(fileContents);
    const contentHtml = processedContent.toString();

    return NextResponse.json({ html: contentHtml });
  } catch (error) {
    console.error('Error reading or processing file:', error);
    return NextResponse.json({ error: 'File not found or could not be processed.' }, { status: 500 });
  }
}

