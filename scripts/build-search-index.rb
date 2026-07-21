#!/usr/bin/env ruby

require "json"
require "nokogiri"
require "pathname"

SITE_ROOT = Pathname.new(__dir__).join("..", "_site").expand_path
OUTPUT_PATH = Pathname.new(__dir__).join("..", "search-index.json").expand_path
PUBLIC_PAGES = [
  "index.html",
  "work/index.html",
  "perspectives/index.html",
  "contact/index.html",
  "terms/index.html"
].freeze

PAGE_METADATA = {
  "index.html" => { title: "Jan Michael Wallace II", category: "About", priority: 28 },
  "work/index.html" => { title: "Selected Work", category: "Work", priority: 26 },
  "perspectives/index.html" => { title: "Perspectives", category: "Perspectives", priority: 22 },
  "contact/index.html" => { title: "Contact Jan Michael", category: "Contact", priority: 24 },
  "terms/index.html" => { title: "Terms of Use and Privacy Policy", category: "Terms & Privacy", priority: 12 }
}.freeze

REMOVED_SELECTORS = [
  "script",
  "style",
  "noscript",
  "svg",
  "button",
  "input",
  "textarea",
  "select",
  "nav",
  "footer",
  "[hidden]",
  "[aria-hidden='true']",
  ".skeleton-title",
  ".skeleton-image",
  ".skeleton-meta-container",
  ".skeleton-text",
  ".consent-banner"
].join(", ").freeze

def clean_text(value)
  value.to_s.gsub(/\s+/, " ").strip
end

def truncate(value, limit = 190)
  text = clean_text(value)
  return text if text.length <= limit

  cut = text[0, limit].sub(/\s+\S*\z/, "")
  "#{cut}…"
end

def public_url(relative_path)
  return "/" if relative_path == "index.html"

  "/#{relative_path.delete_suffix("index.html")}"
end

def searchable_text(node)
  clone = node.dup
  image_descriptions = clone.css("img[alt]").filter_map do |image|
    alt = clean_text(image["alt"])
    alt unless alt.empty?
  end

  clone.css(REMOVED_SELECTORS).remove
  clean_text(([clone.text] + image_descriptions).join(" "))
end

def first_summary(node, fallback)
  authored = clean_text(node["data-search-summary"])
  return truncate(authored) unless authored.empty?

  paragraph = node.css("p").find { |candidate| !clean_text(candidate.text).empty? }
  truncate(paragraph ? paragraph.text : fallback)
end

def record_for(id:, title:, url:, category:, summary:, content:, keywords:, priority:)
  {
    "id" => id,
    "title" => clean_text(title),
    "url" => url,
    "category" => clean_text(category),
    "summary" => truncate(summary),
    "content" => clean_text(content),
    "keywords" => clean_text(keywords),
    "priority" => priority.to_i
  }
end

unless SITE_ROOT.directory?
  warn "Build output not found. Run `bundle exec jekyll build` first."
  exit 1
end

records = []

PUBLIC_PAGES.each do |relative_path|
  file = SITE_ROOT.join(relative_path)
  unless file.file?
    warn "Search index source is missing: #{relative_path}"
    exit 1
  end

  document = Nokogiri::HTML5(file.read)
  main = document.at_css("main#main-content")
  unless main
    warn "Search index source has no main content: #{relative_path}"
    exit 1
  end

  metadata = PAGE_METADATA.fetch(relative_path)
  url = public_url(relative_path)
  description = clean_text(document.at_css('meta[name="description"]')&.[]("content"))
  page_content = searchable_text(main)

  records << record_for(
    id: "page:#{url}",
    title: metadata.fetch(:title),
    url: url,
    category: metadata.fetch(:category),
    summary: description.empty? ? page_content : description,
    content: page_content,
    keywords: clean_text(main["data-search-keywords"]),
    priority: metadata.fetch(:priority)
  )

  main.css("[data-search-section]").each do |section|
    anchor = clean_text(section["id"])
    if anchor.empty?
      warn "Searchable section in #{relative_path} is missing an id."
      exit 1
    end

    heading = section.at_css("h1, h2, h3, h4")
    title = clean_text(section["data-search-title"])
    title = clean_text(heading&.text) if title.empty?
    if title.empty?
      warn "Searchable section ##{anchor} in #{relative_path} is missing a title."
      exit 1
    end

    content = searchable_text(section)
    records << record_for(
      id: "section:#{url}##{anchor}",
      title: title,
      url: "#{url}##{anchor}",
      category: section["data-search-category"] || metadata.fetch(:category),
      summary: first_summary(section, content),
      content: content,
      keywords: section["data-search-keywords"],
      priority: section["data-search-priority"] || 50
    )
  end
end

payload = {
  "version" => 1,
  "records" => records.sort_by { |record| [-record.fetch("priority"), record.fetch("title")] }
}
generated = JSON.pretty_generate(payload) + "\n"

if ARGV.include?("--check")
  unless OUTPUT_PATH.file? && OUTPUT_PATH.read == generated
    warn "search-index.json is stale. Run `ruby scripts/build-search-index.rb` after building the site."
    exit 1
  end

  puts "Search index is current: #{records.length} records cover #{PUBLIC_PAGES.length} public pages."
else
  OUTPUT_PATH.write(generated)
  puts "Wrote #{OUTPUT_PATH}: #{records.length} records cover #{PUBLIC_PAGES.length} public pages."
end
