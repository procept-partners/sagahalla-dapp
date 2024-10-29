// lib/processMarkdown.js
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export async function getMarkdownContent(filename) {
  const filePath = path.join(process.cwd(), 'app', 'victory', 'landing', `${filename}.md`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const processedContent = await remark().use(html).process(fileContents);
    return processedContent.toString();
  } catch (error) {
    console.error('Error processing markdown file:', error);
    return '<p>Unable to load content.</p>';
  }
}
