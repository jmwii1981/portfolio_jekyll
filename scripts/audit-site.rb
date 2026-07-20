#!/usr/bin/env ruby

require "json"
require "pathname"
require "rexml/document"
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
  ids = html.scan(/\bid=(['"])(.*?)\1/i).map(&:last)
  h1_count = html.scan(/<h1\b/i).length
  main_html = html[/<main\b.*?<\/main>/mi]

  failures << "#{relative}: expected exactly one h1, found #{h1_count}" unless h1_count == 1
  failures << "#{relative}: primary h1 must be inside the main landmark" unless main_html&.scan(/<h1\b/i)&.length == 1
  failures << "#{relative}: expected exactly one main landmark" unless html.scan(/<main\b/i).length == 1
  failures << "#{relative}: missing the keyboard-focusable main-content target" unless html.match?(/<main\b[^>]*\bid=(['"])main-content\1[^>]*\btabindex=(['"])-1\2/i)
  failures << "#{relative}: missing the skip link to main content" unless html.match?(/<a\b[^>]*\bclass=(['"])[^'"]*skip-link[^'"]*\1[^>]*\bhref=(['"])#main-content\2/i)
  failures << "#{relative}: labeled home logo must hide its decorative SVG" unless html.match?(/<a\b[^>]*\bclass=(['"])[^'"]*logo-container[^'"]*\1[^>]*\baria-label=(['"])Jan Michael Wallace II, home\2[^>]*>\s*<svg\b[^>]*\baria-hidden=(['"])true\3[^>]*\bfocusable=(['"])false\4/i)

  ids.tally.each do |id, count|
    failures << "#{relative}: duplicate id #{id.inspect}" if count > 1
  end

  html.scan(/\baria-(?:controls|describedby|labelledby)=(['"])(.*?)\1/i).each do |(_, references)|
    references.split.each do |reference|
      failures << "#{relative}: ARIA reference ##{reference} does not exist" unless ids.include?(reference)
    end
  end

  html.scan(/<img\b[^>]*>/i).each do |image|
    failures << "#{relative}: image is missing alt text" unless image.match?(/\balt=(['"]).*?\1/i)
    failures << "#{relative}: company logo is missing its company-name alternative" if image.match?(/\bclass=(['"])[^'"]*company-logo[^'"]*\1/i) && !image.match?(/\balt=(['"])[^'"]+\1/i)

    src = image[/\bsrc=(['"])(.*?)\1/i, 2]
    next unless src&.start_with?("/")

    asset_path = URI.decode_www_form_component(src.split("?").first).delete_prefix("/")
    asset = site_root.join(asset_path)
    failures << "#{relative}: missing local image #{src}" unless asset.file?

    if asset_path.match?(/\.(?:avif|jpe?g|png|webp)$/i)
      failures << "#{relative}: raster image #{src} is missing width" unless image.match?(/\bwidth=(['"])\d+\1/i)
      failures << "#{relative}: raster image #{src} is missing height" unless image.match?(/\bheight=(['"])\d+\1/i)
    end
  end

  html.scan(/<(?:img|source)\b[^>]*\bsrcset=(['"])(.*?)\1[^>]*>/i).each do |(_, srcset)|
    srcset.split(",").each do |candidate|
      source = candidate.strip.split(/\s+/, 2).first
      next unless source&.start_with?("/")

      asset_path = URI.decode_www_form_component(source.split("?").first).delete_prefix("/")
      failures << "#{relative}: missing local srcset image #{source}" unless site_root.join(asset_path).file?
    end
  end

  html.scan(/<a\b[^>]*target=(?:"_blank"|'_blank')[^>]*>/i).each do |link|
    failures << "#{relative}: target=_blank link is missing rel=noopener" unless link.match?(/\brel=(['"])[^'"]*noopener[^'"]*\1/i)
  end

  html.scan(/<a\b[^>]*\bclass=(['"])[^'"]*social-icon[^'"]*\1[^>]*>.*?<\/a>/mi) do
    markup = Regexp.last_match[0]
    failures << "#{relative}: social icon link is missing an accessible label" unless markup.match?(/\baria-label=(['"])[^'"]+\1/i)
    failures << "#{relative}: social icon SVG must be hidden from assistive technology" unless markup.match?(/<svg\b[^>]*\baria-hidden=(['"])true\1[^>]*\bfocusable=(['"])false\2/i)
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

contact = site_root.join("contact", "index.html")
if contact.file?
  html = contact.read
  failures << "contact/index.html: Web3Forms action is missing" unless html.match?(/<form\b[^>]*action=(['"])https:\/\/api\.web3forms\.com\/submit\1/i)
  failures << "contact/index.html: Web3Forms access key is missing" unless html.match?(/<input\b[^>]*name=(['"])access_key\1[^>]*value=(['"])[^'"]+\2/i)
  failures << "contact/index.html: honeypot field is missing" unless html.match?(/<input\b[^>]*name=(['"])botcheck\1/i)
  failures << "contact/index.html: direct email fallback is missing" unless html.match?(/<a\b[^>]*href=(['"])mailto:hello@janmichael\.io\1/i)
  failures << "contact/index.html: form status live region is missing" unless html.match?(/\bdata-contact-status\b[^>]*\baria-live=(['"])polite\1/i)

  html.scan(/<(?:input|textarea)\b[^>]*\brequired\b[^>]*>/i).each do |field|
    id = field[/\bid=(['"])(.*?)\1/i, 2]
    described_by = field[/\baria-describedby=(['"])(.*?)\1/i, 2]
    failures << "contact/index.html: required field is missing an id" unless id
    failures << "contact/index.html: required field ##{id} is missing persistent error help" unless described_by&.split&.include?("#{id}-error")
  end
else
  failures << "contact/index.html: missing from build output"
end

not_found = site_root.join("404.html")
if not_found.file?
  failures << "404.html: missing noindex robots directive" unless not_found.read.match?(/<meta\b[^>]*name=(['"])robots\1[^>]*content=(['"])[^'"]*noindex[^'"]*\2/i)
else
  failures << "404.html: missing from build output"
end

browserconfig = site_root.join("favicons", "browserconfig.xml")
if browserconfig.file?
  begin
    REXML::Document.new(browserconfig.read)
  rescue REXML::ParseException => error
    failures << "favicons/browserconfig.xml: invalid XML (#{error.message})"
  end
else
  failures << "favicons/browserconfig.xml: missing from build output"
end

sitemap = site_root.join("sitemap.xml")
if sitemap.file?
  contents = sitemap.read
  failures << "sitemap.xml: contains an insecure HTTP URL" if contents.match?(%r{<loc>http://}i)
  failures << "sitemap.xml: references removed endorsements page" if contents.include?("/endorsements/")
  failures << "sitemap.xml: references the noindex 404 page" if contents.include?("/404")
else
  failures << "sitemap.xml: missing from build output"
end

if failures.any?
  warn failures.join("\n")
  exit 1
end

puts "Site audit passed: structure, ARIA references, image delivery, contact fallback, metadata, external-link safety, JSON-LD/XML, and sitemap checks."
