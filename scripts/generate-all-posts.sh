#!/bin/bash
# Generate complete posts JSON from all markdown files

POSTS_DIR="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/content/posts"
OUTPUT_FILE="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/data/generated-posts.json"
TEMP_FILE="/tmp/posts-temp.txt"

echo "Finding markdown files..."

# Clear temp file
> "$TEMP_FILE"

# Find all markdown files and process them
find "$POSTS_DIR" -name "*.md" -type f | sort | while read -r file; do
    # Extract filename and slug
    filename=$(basename "$file" .md)
    slug=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

    # Read front matter section
    title=""
    category=""
    publishedAt=""
    author=""
    imageUrl=""
    readTime=""

    # Read first 12 lines and extract values
    while IFS= read -r line; do
        case "$line" in
            title:*) title="${line#title: }" ;;
            category:*) category="${line#category: }" ;;
            publishedAt:*) publishedAt="${line#publishedAt: }" ;;
            author:*) author="${line#author: }" ;;
            imageUrl:*) imageUrl="${line#imageUrl: }" ;;
            readTime:*) readTime="${line#readTime: }" ;;
        esac
    done < <(head -12 "$file")

    # Remove quotes
    title="${title//\"/}"
    category="${category//\"/}"
    publishedAt="${publishedAt//\"/}"
    author="${author//\"/}"
    imageUrl="${imageUrl//\"/}"
    readTime="${readTime//\"/}"

    # Clean title - remove chapter prefixes
    cleanTitle="$title"
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^Chapter [0-9]+ - Chapter [#]?[0-9]+[:.] *//')
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^Chapter [0-9]+ - [0-9]+\. *//')
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^[0-9]+[-. ]+//')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^The Heroes and Villians Series - //')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^Lesson Plans for //')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^Lesson Plans on //')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^Lesson Plans of //')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^Lesson Plans about //')

    # Default values
    [ -z "$author" ] && author="Zack Edwards"
    [ -z "$publishedAt" ] && publishedAt="January 1, 2025"
    [ -z "$imageUrl" ] && imageUrl="/images/fullLogo.jpeg"
    [ -z "$readTime" ] && readTime="5 min read"
    [ -z "$category" ] && category="General"
    [ -z "$cleanTitle" ] && cleanTitle="$filename"

    # Get excerpt from content (after front matter)
    excerpt=$(sed -n '11,15p' "$file" | tr '\n' ' ' | sed 's/\*\*//g' | sed 's/  */ /g' | cut -c1-180)
    [ -z "$excerpt" ] && excerpt="$cleanTitle"

    # Escape special characters
    cleanTitle="${cleanTitle//\"/\\\"}"
    excerpt="${excerpt//\"/\\\"}"

    # Output to temp file
    echo "$slug|$cleanTitle|$excerpt|$author|$category|$publishedAt|$readTime|$imageUrl" >> "$TEMP_FILE"
done

echo "Processing complete. Building JSON..."

# Build JSON from temp file
{
    echo "["
    first=true
    while IFS='|' read -r slug title excerpt author category publishedAt readTime imageUrl; do
        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi
        cat << EOF
  {
    "id": "$slug",
    "title": "$title",
    "excerpt": "$excerpt...",
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
    done < "$TEMP_FILE"
    echo "]"
} > "$OUTPUT_FILE"

count=$(grep -c '"id":' "$OUTPUT_FILE")
echo "Done! Generated $count posts to $OUTPUT_FILE"
