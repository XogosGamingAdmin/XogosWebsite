#!/usr/bin/env python3
"""
Generate blog posts JSON from markdown files.
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path

# Configuration
POSTS_DIR = Path(__file__).parent.parent / "content" / "posts"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "generated-posts.json"


def find_markdown_files(directory):
    """Recursively find all .md files in a directory."""
    md_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files


def parse_front_matter(content):
    """Parse YAML front matter from markdown content."""
    pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(pattern, content, re.DOTALL)

    if not match:
        return {}, content

    front_matter_str = match.group(1)
    body_content = content[match.end():].strip()

    # Parse YAML-like key-value pairs
    data = {}
    for line in front_matter_str.split('\n'):
        if ':' in line:
            key = line.split(':', 1)[0].strip()
            value = line.split(':', 1)[1].strip()
            # Remove quotes
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            data[key] = value

    return data, body_content


def format_category(folder_name):
    """Format category from folder name (e.g., 'ai-education' -> 'Ai Education')."""
    return ' '.join(word.capitalize() for word in folder_name.split('-'))


def generate_slug(filename):
    """Generate slug from filename."""
    slug = filename.replace('.md', '').lower()
    slug = re.sub(r'\s+', '-', slug)
    return slug


def clean_title(title):
    """Clean title by removing 'Chapter X - Chapter X:' prefix patterns."""
    if not title:
        return ''

    # Remove patterns like "Chapter 1 - Chapter 1:", "Chapter 1 - Chapter #1:", etc.
    cleaned = re.sub(r'^Chapter\s*\d+\s*[-–]\s*Chapter\s*[#]?\d+[:.]\s*', '', title, flags=re.IGNORECASE)

    # Remove patterns like "Chapter 1 - 1." at the beginning
    cleaned = re.sub(r'^Chapter\s*\d+\s*[-–]\s*\d+\.\s*', '', cleaned, flags=re.IGNORECASE)

    # Remove leading numbers like "1. " or "12-" if they're part of the title
    cleaned = re.sub(r'^\d+[-.\s]+\s*', '', cleaned)

    return cleaned.strip()


def get_excerpt(content, max_length=200):
    """Extract excerpt from content, removing markdown formatting."""
    # Remove markdown formatting
    text = content
    text = re.sub(r'\*\*', '', text)  # Remove bold
    text = re.sub(r'\*', '', text)     # Remove italic
    text = re.sub(r'#{1,6}\s+', '', text)  # Remove headers
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)  # Convert links to text
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)  # Remove images
    text = re.sub(r'`{1,3}[^`]*`{1,3}', '', text)  # Remove code
    text = re.sub(r'\n+', ' ', text)  # Replace newlines with spaces
    text = text.strip()

    if len(text) <= max_length:
        return text

    return text[:max_length].strip() + '...'


def get_category_from_path(file_path, posts_dir):
    """Get category from file path structure."""
    rel_path = os.path.relpath(file_path, posts_dir)
    parts = rel_path.replace('\\', '/').split('/')

    if len(parts) > 1:
        # For nested folders like history/ancient-egypt, combine them
        if len(parts) > 2:
            return format_category(parts[0]) + ' - ' + format_category(parts[1])
        return format_category(parts[0])

    return 'General'


def parse_date(date_str):
    """Parse date string to datetime object for sorting."""
    if not date_str:
        return datetime(2025, 1, 1)

    months = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    }

    # Format: "December 2, 2025"
    match = re.match(r'(\w+)\s+(\d+),?\s+(\d{4})', date_str, re.IGNORECASE)
    if match:
        month_name = match.group(1).lower()
        day = int(match.group(2))
        year = int(match.group(3))
        month = months.get(month_name)
        if month:
            try:
                return datetime(year, month, day)
            except ValueError:
                pass

    # Try standard date parsing
    try:
        return datetime.fromisoformat(date_str.replace('/', '-'))
    except:
        pass

    return datetime(2025, 1, 1)


def main():
    print("Finding markdown files...")
    markdown_files = find_markdown_files(POSTS_DIR)
    print(f"Found {len(markdown_files)} markdown files")

    posts = []

    for idx, file_path in enumerate(markdown_files):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            front_matter, body_content = parse_front_matter(content)

            filename = os.path.basename(file_path)
            slug = generate_slug(filename)

            # Get category from front matter or folder
            category = front_matter.get('category') or get_category_from_path(file_path, POSTS_DIR)

            # Clean up the title
            title = clean_title(front_matter.get('title', '')) or slug.replace('-', ' ')

            # Get excerpt
            excerpt = front_matter.get('excerpt', '')
            if not excerpt or excerpt == 'Home' or len(excerpt) < 20:
                excerpt = get_excerpt(body_content)

            # Build the post object
            post = {
                "id": slug,
                "title": title,
                "excerpt": excerpt,
                "content": "",
                "author": {
                    "name": front_matter.get('author', 'Zack Edwards'),
                    "avatar": "/images/board/zack.png",
                    "role": "Content Creator"
                },
                "category": category,
                "publishedAt": front_matter.get('publishedAt', 'January 1, 2025'),
                "readTime": front_matter.get('readTime', '5 min read'),
                "imageUrl": front_matter.get('imageUrl', '/images/fullLogo.jpeg'),
                "featured": front_matter.get('featured', 'false').lower() == 'true'
            }

            posts.append(post)

            if (idx + 1) % 50 == 0:
                print(f"Processed {idx + 1}/{len(markdown_files)} files...")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    # Sort by publishedAt date (newest first)
    posts.sort(key=lambda p: parse_date(p['publishedAt']), reverse=True)

    # Ensure data directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Write to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully generated {len(posts)} posts to {OUTPUT_FILE}")

    # Print category summary
    categories = {}
    for post in posts:
        cat = post['category']
        categories[cat] = categories.get(cat, 0) + 1

    print("\nCategory breakdown:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count} posts")


if __name__ == '__main__':
    main()
