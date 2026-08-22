import re

# Assignment from our JS script
assignments = {
    "bone-crew-tee": "/images/campaign/campaign-01-editorial.webp",
    "noir-crew-tee": "/images/campaign/campaign-01-hero-mobile.webp",
    "graphite-long-sleeve-tee": "/images/campaign/campaign-01-mobile.webp",
    "olive-crew-tee": "/images/campaign/campaign-02-editorial.webp",
    "burgundy-long-sleeve-tee": "/images/campaign/campaign-02-hero-mobile.webp",
    "ink-crew-tee": "/images/campaign/campaign-02-mobile.webp",
    "clay-pullover-hoodie": "/images/ai/editorial/sus-editorial-lagos-01.webp",
    "noir-zip-hoodie": "/images/ai/editorial/sus-editorial-lagos-02.webp",
    "steel-pullover-hoodie": "/images/ai/editorial/sus-editorial-western-01.webp",
    "espresso-zip-hoodie": "/images/ai/editorial/sus-editorial-western-02.webp",
    "bone-pullover-hoodie": "/images/ai/heroes/sus-hero-04b-nvidia-test.webp",
    "graphite-zip-hoodie": "/images/campaign/campaign-01-desktop-1600.webp",
    "sand-trench-coat": "/images/campaign/campaign-01-desktop.webp",
    "noir-bomber-jacket": "/images/campaign/campaign-02-desktop-1600.webp",
    "espresso-trench-coat": "/images/campaign/campaign-02-desktop.webp",
    "olive-bomber-jacket": "/images/ai/heroes/sus-hero-signature-01.webp",
    "steel-trench-coat": "/images/ai/heroes/sus-hero-04b-final-check.webp",
    "burgundy-bomber-jacket": "/images/campaign/campaign-01-editorial.webp",
    "ink-cap": "/images/campaign/campaign-01-hero-mobile.webp",
    "bone-beanie": "/images/campaign/campaign-01-mobile.webp",
    "espresso-tote": "/images/campaign/campaign-02-editorial.webp",
    "clay-leather-belt": "/images/campaign/campaign-02-hero-mobile.webp",
    "steel-scarf": "/images/campaign/campaign-02-mobile.webp",
    "noir-socks-three-pack": "/images/ai/editorial/sus-editorial-lagos-01.webp",
}

# Read the file
with open('/root/sus-wears/src/data/catalogue.ts', 'r') as f:
    content = f.read()

# Pattern to match a product entry
# We'll find each product by its slug and then replace the first image
# This is simpler: find each 'slug: "X",' then look ahead for the images array

# Instead, let's do a more direct approach: find each product block
# But given the structure is regular, we can do slug-based replacement

# First, let's make a more robust pattern
# We'll look for: slug: "product-slug", followed eventually by: images: [
# and replace the first { src: "OLD", alt: "..." }

def replace_first_image(content, slug, new_src):
    # Find the product with this slug
    slug_pattern = f'slug: \"{slug}\",'
    slug_match = re.search(slug_pattern, content)
    if not slug_match:
        print(f"WARNING: Slug {slug} not found")
        return content
    
    # From the slug match, look ahead for the images array
    start = slug_match.end()
    # Find the images: [ after this point
    images_match = re.search(r'images:\s*\[', content[start:])
    if not images_match:
        print(f"WARNING: No images array found for {slug}")
        return content
    
    images_start = start + images_match.start()
    # Now find the first image object after images:
    # Pattern: \s*\{ src: \"[^\"]*\"
    first_image_match = re.search(r'\{\s*src:\s*\"([^\"]*)\"', content[images_start:])
    if not first_image_match:
        print(f"WARNING: No first image found for {slug}")
        return content
    
    old_src = first_image_match.group(1)
    # Replace just the src value
    old_full = first_image_match.group(0)
    new_first_image = old_full.replace(old_src, new_src)
    
    # Replace in content
    pos = images_start + first_image_match.start()
    content = content[:pos] + new_first_image + content[pos + len(old_full):]
    
    print(f"Updated {slug}: {old_src} → {new_src}")
    return content

# Apply all assignments
for slug, new_src in assignments.items():
    content = replace_first_image(content, slug, new_src)

# Write back
with open('/root/sus-wears/src/data/catalogue.ts', 'w') as f:
    f.write(content)

print("Done.")
