#!/bin/bash
# Fast JSON generator - processes all files in a single pass

POSTS_DIR="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/content/posts"
OUTPUT_FILE="C:/Users/edwar/OneDrive/Documents/Business/Xogos Gaming, Inc/0. Xogos Code/XogosWebsite/data/generated-posts.json"

echo "Building posts JSON..."

# Start JSON
echo "[" > "$OUTPUT_FILE"

# Find all files and process inline
count=0
first=true

for file in $(find "$POSTS_DIR" -name "*.md" -type f 2>/dev/null); do
    # Get filename for slug
    fname=$(basename "$file" .md)
    slug=$(echo "$fname" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    # Extract front matter values using grep
    title=$(grep -m1 "^title:" "$file" | cut -d'"' -f2)
    category=$(grep -m1 "^category:" "$file" | cut -d'"' -f2)
    publishedAt=$(grep -m1 "^publishedAt:" "$file" | cut -d'"' -f2)
    author=$(grep -m1 "^author:" "$file" | cut -d'"' -f2)
    imageUrl=$(grep -m1 "^imageUrl:" "$file" | cut -d'"' -f2)
    readTime=$(grep -m1 "^readTime:" "$file" | cut -d'"' -f2)

    # Clean title
    cleanTitle="$title"
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^Chapter [0-9]+ - (Chapter [#]?[0-9]+[:.] ?)?//')
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^[0-9]+[-. ]+//')
    cleanTitle=$(echo "$cleanTitle" | sed 's/^The Heroes and Villians Series - //')
    cleanTitle=$(echo "$cleanTitle" | sed -E 's/^Lesson Plans (for|on|of|about) //')

    # Set defaults
    : "${author:=Zack Edwards}"
    : "${publishedAt:=January 1, 2025}"
    : "${imageUrl:=/images/fullLogo.jpeg}"
    : "${readTime:=5 min read}"
    : "${category:=General}"
    : "${cleanTitle:=$fname}"

    # Get excerpt
    excerpt=$(sed -n '12,14p' "$file" 2>/dev/null | tr '\n' ' ' | sed 's/\*\*//g' | sed 's/"//g' | cut -c1-150)
    : "${excerpt:=$cleanTitle}"

    # Escape quotes in title and excerpt
    cleanTitle="${cleanTitle//\"/}"
    excerpt="${excerpt//\"/}"

    # Add comma for subsequent items
    if [ "$first" = "true" ]; then
        first=false
    else
        printf ",\n" >> "$OUTPUT_FILE"
    fi

    # Write JSON entry
    printf '  {\n    "id": "%s",\n    "title": "%s",\n    "excerpt": "%s...",\n    "content": "",\n    "author": {\n      "name": "%s",\n      "avatar": "/images/board/zack.png",\n      "role": "Content Creator"\n    },\n    "category": "%s",\n    "publishedAt": "%s",\n    "readTime": "%s",\n    "imageUrl": "%s",\n    "featured": false\n  }' \
        "$slug" "$cleanTitle" "$excerpt" "$author" "$category" "$publishedAt" "$readTime" "$imageUrl" >> "$OUTPUT_FILE"

    count=$((count + 1))
    if [ $((count % 50)) -eq 0 ]; then
        echo "Processed $count files..."
    fi
done

# Close JSON array
printf "\n]\n" >> "$OUTPUT_FILE"

echo "Generated $count posts to $OUTPUT_FILE"
