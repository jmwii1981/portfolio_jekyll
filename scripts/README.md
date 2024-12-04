
# Scripts Overview

This folder contains modular JavaScript functions designed for fetching, processing, sequencing, and rendering content from a Medium RSS feed or JSON API. The scripts handle various data types like titles, images, publication dates, and content bodies, ensuring they are structured and formatted consistently for rendering.

## Files and Responsibilities

### 1. `initializeScripts.js`
- **Purpose:** Acts as the main entry point for initializing all scripts within the `perspectives` folder.
- **Key Functionality:** Dynamically calls `renderPost.mjs` to fetch and render the most recent Medium post.
- **Error Handling:** Logs any initialization errors for debugging.

### 2. `fetchPost.mjs`
- **Purpose:** Fetches post data from the RSStoJSON API or falls back to a raw RSS feed.
- **Outputs:** Structured data containing `title`, `content`, `image`, and `pubDateAndTime`.
- **Fallbacks:** If the JSON API fails, it fetches and parses RSS data using regex.
- **Error Handling:** Logs raw JSON and RSS data for debugging. Provides detailed error messages for both JSON and RSS fetch attempts.

### 3. `grabContentBody.mjs`
- **Purpose:** Extracts and sanitizes the post content body.
- **Outputs:** HTML content with:
  - Paragraphs wrapped in `<p>` tags with `class="p"`.
  - Inline elements (e.g., `<b>`, `<em>`) given corresponding class names.
- **Error Handling:** Logs warnings for empty or malformed content.

### 4. `grabImage.mjs`
- **Purpose:** Extracts the featured image and wraps it in an `<img>` tag.
- **Outputs:** `<img>` tag with `class="img post-featured-image"`.
- **Error Handling:** Logs warnings for missing images and provides a fallback message.

### 5. `grabPubDateAndTime.mjs`
- **Purpose:** Extracts and formats the publication date and time.
- **Outputs:** `<p>` tag with `class="p pubDate"`, formatted as `Long Month Name, numerical date, four-digit year`.
- **Error Handling:** Logs warnings for missing or malformed dates.

### 6. `grabTitle.mjs`
- **Purpose:** Extracts and sanitizes the title.
- **Outputs:** `<h2>` tag with `class="h2 post-title"` containing the sanitized title.
- **Error Handling:** Logs warnings for missing or malformed titles.

### 7. `postContentSequencing.mjs`
- **Purpose:** Combines outputs from the `grab` functions into a structured object.
- **Outputs:** Sequenced data object with fields for `image`, `title`, `pubDateAndTime`, and `contentBody`.
- **Fallbacks:** Provides default placeholders for missing data (e.g., "No Title Available").
- **Error Handling:** Logs specific failures for each `grab` function.

### 8. `renderPost.mjs`
- **Purpose:** Dynamically renders sequenced post data into an HTML structure.
- **Key Features:**
  - Creates a `<div>` with `class="most-recent-post"` inside a `<section>` element with `id="post-content-wrapper"`.
  - Appends the `image`, `title`, `pubDateAndTime`, and `contentBody` in sequence, separated by `<hr>` elements with `class="post-content-divider"`.
- **Error Handling:** Logs rendering success or failure.

## Design Principles
1. **Modularity:** Each function handles a single responsibility, ensuring reusability and clarity.
2. **Error Handling:** Detailed logging for debugging and graceful fallbacks for missing data.
3. **Scalability:** Easily extendable for additional data fields or formatting requirements.
4. **Consistency:** Uniform handling of JSON and RSS sources ensures predictable outputs.

## Usage
1. Place all files in the appropriate directories as structured.
2. Reference `initializeScripts.js` in your HTML as follows:
   ```html
   <script type="module" src="/scripts/initializeScripts.js"></script>
   ```
3. Ensure the feed URL passed to the functions is valid.
4. Check logs for detailed debugging information if any errors occur.

## Contribution
For improvements or bug fixes, please ensure all updates adhere to the modular and scalable design principles outlined above.
