---
layout: page
title: Test for Makenzie
permalink: /test/
---

<main class="main {% if page.url == '/test/' %}test{% endif %}">
    <section id="test" class="test" style="
        display: flex;
        flex-direction: column;
        width: 100%;
    ">
  <!-- The JavaScript will dynamically inject the post here -->  
        <script type="module">
            class MediumPost {
            constructor(feedUrl) {
                this.feedUrl = feedUrl;
                this.apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;
            }

            async fetchPost() {
                try {
                const response = await fetch(this.apiUrl);
                if (!response.ok) throw new Error('Failed to fetch data from the primary API.');
                const data = await response.json();
                return data;
                } catch (error) {
                console.error('Error fetching post:', error);
                throw new Error('Both primary and backup APIs failed.');
                }
            }

            cleanData(post) {
                try {
                const { title, pubDate, content } = post;

                // Format the date and time to EST
                const gmtDate = new Date(pubDate);
                const estDate = new Date(gmtDate.getTime() - 5 * 60 * 60 * 1000);
                const formattedDate = estDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZoneName: 'short'
                });

                // Parse content to extract first valid image with figure and caption
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const figures = Array.from(doc.querySelectorAll('figure'));
                let imageFigure = '';
                for (const figure of figures) {
                    const img = figure.querySelector('img');
                    if (img && img.naturalWidth > 1 && img.naturalHeight > 1) {
                    const caption = figure.querySelector('figcaption')?.outerHTML || '';
                    imageFigure = `<figure class="figure"><img class="img" src="${img.src}" alt="${img.alt || ''}">${caption}</figure>`;
                    break;
                    }
                }

                // Add classes to HTML elements
                doc.body.querySelectorAll('*').forEach((el) => {
                    el.classList.add(el.tagName.toLowerCase());
                });

                return {
                    title: `<h1 class="h1 title">${title}</h1>`,
                    date: `<time class="time timestamp">${formattedDate}</time>`,
                    image: imageFigure,
                    content: doc.body.innerHTML
                };
                } catch (error) {
                console.error('Error cleaning data:', error);
                throw new Error('Failed to clean post data.');
                }
            }

            render(postData) {
                try {
                const { title, date, image, content } = postData;
                const container = document.createElement('div');
                container.className = 'most-recent-post';
                container.innerHTML = `${image}${title}${date}<div class="content">${content}</div>`;

                // Inject into the <section id="test">
                const section = document.getElementById('test');
                if (!section) {
                    throw new Error('No <section> with id="test" found on the page.');
                }
                section.appendChild(container);
                } catch (error) {
                console.error('Error rendering post:', error);
                throw new Error('Failed to render post.');
                }
            }

            async init() {
                try {
                const data = await this.fetchPost();
                if (!data || !data.items || data.items.length === 0) {
                    throw new Error('No posts available in the feed.');
                }
                const mostRecentPost = data.items[0];
                const cleanedData = this.cleanData(mostRecentPost);
                this.render(cleanedData);
                } catch (error) {
                console.error('Error initializing MediumPost:', error);
                }
            }
            }

            // Usage
            const mediumFeedUrl = 'https://medium.com/feed/@jmwii1981';
            const mediumPost = new MediumPost(mediumFeedUrl);
            mediumPost.init();

        </script>
      </section>
</main>