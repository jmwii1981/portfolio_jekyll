#!/usr/bin/env ruby

require "json"
require "pathname"
require "uri"

site_root = Pathname.new(__dir__).join("..", "_site").expand_path
failures = []

unless site_root.directory?
  warn "Build output not found. Run `bundle exec jekyll build` first."
  exit 1
end

site_root.glob("**/*.html").each do |file|
  html = file.read
  relative = file.relative_path_from(site_root)
  h1_count = html.scan(/<h1\b/i).length
  failures << "#{relative}: expected exactly one h1, found #{h1_count}" unless h1_count == 1
  failures << "#{relative}: branded h1 is missing its accessible name" unless html.match?(/<h1\b[^>]*class=(['"])[^'"]*site-identity[^'"]*\1[^>]*aria-label=(['"])Jan Michael Wallace II\2/i)
  failures << "#{relative}: expected exactly one main landmark" unless html.scan(/<main\b/i).length == 1

  html.scan(/<img\b[^>]*>/i).each do |image|
    failures << "#{relative}: image is missing alt text" unless image.match?(/\balt=(['"]).*?\1/i)

    src = image[/\bsrc=(['"])(.*?)\1/i, 2]
    next unless src&.start_with?("/")

    asset_path = URI.decode_www_form_component(src.split("?").first).delete_prefix("/")
    asset = site_root.join(asset_path)
    failures << "#{relative}: missing local image #{src}" unless asset.file?
  end

  html.scan(/<a\b[^>]*target=(?:"_blank"|'_blank')[^>]*>/i).each do |link|
    failures << "#{relative}: target=_blank link is missing rel=noopener" unless link.match?(/\brel=(['"])[^'"]*noopener[^'"]*\1/i)
  end

  html.scan(/<a\b[^>]*href=(['"])(.*?)\1[^>]*>/i).each do |(_, href)|
    next unless href.start_with?("/")

    path = href.split(/[?#]/).first
    destination = site_root.join(path.delete_prefix("/"))
    destination = destination.join("index.html") if path.end_with?("/")
    failures << "#{relative}: broken internal link #{href}" unless destination.file?
  end

  html.scan(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>(.*?)<\/script>/mi).each do |(_, json)|
    JSON.parse(json)
  rescue JSON::ParserError => error
    failures << "#{relative}: invalid JSON-LD (#{error.message})"
  end
end

sitemap = site_root.join("sitemap.xml")
if sitemap.file?
  contents = sitemap.read
  failures << "sitemap.xml: contains an insecure HTTP URL" if contents.match?(%r{<loc>http://}i)
  failures << "sitemap.xml: references removed endorsements page" if contents.include?("/endorsements/")
else
  failures << "sitemap.xml: missing from build output"
end

if failures.any?
  warn failures.join("\n")
  exit 1
end

puts "Site audit passed: headings, image alternatives, external-link safety, JSON-LD, and sitemap checks."
