#!/bin/bash
#Note: This is totally AI slop, so don't trust it 100% :)

# Create output folder if it doesn't exist
mkdir -p output

for f in *.{jpg,jpeg,png}; do
    # Skip if no matching files
    [ -e "$f" ] || continue

    base="$(basename "$f" | sed 's/\.[^.]*$//')"  # filename without extension

    echo "Processing: $f"

    # Convert to WebP (quality-focused)
    ffmpeg -i "$f" -map_metadata -1 \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
        -q:v 40 "output/${base}.webp" -y

    # Convert to AVIF (size-focused)
    ffmpeg -i "$f" -map_metadata -1 \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
        -c:v libaom-av1 -crf 35 -b:v 0 "output/${base}.avif" -y

    # Compare file sizes
    webp_size=$(stat -c%s "output/${base}.webp")
    avif_size=$(stat -c%s "output/${base}.avif")

    if [ "$avif_size" -lt "$webp_size" ]; then
        echo " → Keeping AVIF (smaller)"
        rm -f "output/${base}.webp"
    else
        echo " → Keeping WebP (smaller)"
        rm -f "output/${base}.avif"
    fi
done

echo "✅ All images processed into ./output"

