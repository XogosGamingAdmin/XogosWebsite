#!/bin/bash
# Build posts JSON from markdown files without Node.js dependencies

POSTS_DIR="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/content/posts"
OUTPUT_FILE="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/data/generated-posts.json"

echo "Finding markdown files..."

# Start JSON array
echo "[" > "$OUTPUT_FILE"

first=true

# Find all markdown files
find "$POSTS_DIR" -name "*.md" -type f | while read -r file; do
    # Extract filename and slug
    filename=$(basename "$file" .md)
    slug=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

    # Read first 15 lines to get front matter
    frontmatter=$(head -15 "$file")

    # Extract values using grep and sed
    title=$(echo "$frontmatter" | grep "^title:" | sed 's/^title: *"//' | sed 's/"$//')
    category=$(echo "$frontmatter" | grep "^category:" | sed 's/^category: *"//' | sed 's/"$//')
    publishedAt=$(echo "$frontmatter" | grep "^publishedAt:" | sed 's/^publishedAt: *"//' | sed 's/"$//')
    author=$(echo "$frontmatter" | grep "^author:" | sed 's/^author: *"//' | sed 's/"$//')
    imageUrl=$(echo "$frontmatter" | grep "^imageUrl:" | sed 's/^imageUrl: *"//' | sed 's/"$//')
    readTime=$(echo "$frontmatter" | grep "^readTime:" | sed 's/^readTime: *"//' | sed 's/"$//')

    # Clean title - remove "Chapter X - Chapter X:" patterns
    cleanTitle=$(echo "$title" | sed -E 's/^Chapter [0-9]+ - Chapter [#]?[0-9]+[:.] *//' | sed -E 's/^[0-9]+[-. ]+//')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^The Heroes and Villians Series - //' | sed 's/^Lesson Plans for //' | sed 's/^Lesson Plans on //')

    # Default values
    [ -z "$author" ] && author="Zack Edwards"
    [ -z "$publishedAt" ] && publishedAt="January 1, 2025"
    [ -z "$imageUrl" ] && imageUrl="/images/fullLogo.jpeg"
    [ -z "$readTime" ] && readTime="5 min read"
    [ -z "$category" ] && category="General"
    [ -z "$cleanTitle" ] && cleanTitle="$filename"

    # Get excerpt from content (after front matter)
    content=$(tail -n +12 "$file" | head -5 | tr '\n' ' ' | sed 's/\*\*//g' | sed 's/  */ /g' | cut -c1-200)
    [ -z "$content" ] && content="$cleanTitle"

    # Add comma if not first
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi

    # Escape special characters for JSON
    cleanTitle=$(echo "$cleanTitle" | sed 's/"/\\"/g')
    content=$(echo "$content" | sed 's/"/\\"/g')

    # Write JSON object
    cat >> "$OUTPUT_FILE" << EOF
  {
    "id": "$slug",
    "title": "$cleanTitle",
    "excerpt": "$content...",
    "content": "",
    "author": {
      "name": "$author",
      "avatar": "/images/board/zack.png",
      "role": "Content Creator"
    },
    "category": "$category",
    "publishedAt": "$publishedAt",
    "readTime": "$readTime",
    "imageUrl": "$imageUrl",
    "featured": false
  }
EOF

done

# Close JSON array
echo "]" >> "$OUTPUT_FILE"

echo "Done! Generated posts to $OUTPUT_FILE"
