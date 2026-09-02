#!/usr/bin/env ruby

require "json"
require "pathname"
require "rexml/document"
require "time"
require "uri"
require "yaml"

source_root = Pathname.new(__dir__).join("..").expand_path
site_root = source_root.join("_site")
vitae_projects = YAML.safe_load_file(source_root.join("_data", "vitae_projects.yml"))
failures = []
legacy_redirects = {
  "about/index.html" => {
    target: "/#about",
    canonical: "https://janmichael.io/"
  },
  "endorsements/index.html" => {
    target: "/#recommendations",
    canonical: "https://janmichael.io/"
  },
  "experience/index.html" => {
    target: "/vitae/",
    canonical: "https://janmichael.io/vitae/"
  },
  "work/index.html" => {
    target: "/vitae/",
    canonical: "https://janmichael.io/vitae/"
  },
  "work/lionfinancial/index.html" => {
    target: "/vitae/lionfinancial/",
    canonical: "https://janmichael.io/vitae/lionfinancial/"
  },
  "work/vega/index.html" => {
    target: "/vitae/vega/",
    canonical: "https://janmichael.io/vitae/vega/"
  },
  "work/avenapay/index.html" => {
    target: "/vitae/avenapay/",
    canonical: "https://janmichael.io/vitae/avenapay/"
  },
  "work/paladin/index.html" => {
    target: "/vitae/paladin/",
    canonical: "https://janmichael.io/vitae/paladin/"
  },
  "work/ledgerflow/index.html" => {
    target: "/vitae/ledgerflow/",
    canonical: "https://janmichael.io/vitae/ledgerflow/"
  },
  "work/northstar/index.html" => {
    target: "/vitae/northstar/",
    canonical: "https://janmichael.io/vitae/northstar/"
  }
}.freeze

def valid_structured_data_datetime?(value)
  return false unless value.is_a?(String) && value.match?(/\A\d{4}-\d{2}-\d{2}T/)

  Time.iso8601(value)
  true
rescue ArgumentError
  false
end

unless site_root.directory?
  warn "Build output not found. Run `bundle exec jekyll build` first."
  exit 1
end

site_root.glob("**/*.html").each do |file|
  relative = file.relative_path_from(site_root)
  next if legacy_redirects.key?(relative.to_s)

  html = file.read
  ids = html.scan(/\bid=(['"])(.*?)\1/i).map(&:last)
  h1_count = html.scan(/<h1\b/i).length
  main_html = html[/<main\b.*?<\/main>/mi]
  standalone_links_page = relative.to_s == "links/index.html"

  failures << "#{relative}: root element must begin in the resilient no-js state" unless html.match?(/<html\b[^>]*\bclass=(['"])[^'"]*\bno-js\b[^'"]*\1/i)
  failures << "#{relative}: expected exactly one h1, found #{h1_count}" unless h1_count == 1
  failures << "#{relative}: primary h1 must be inside the main landmark" unless main_html&.scan(/<h1\b/i)&.length == 1
  failures << "#{relative}: expected exactly one main landmark" unless html.scan(/<main\b/i).length == 1
  failures << "#{relative}: missing the keyboard-focusable main-content target" unless html.match?(/<main\b[^>]*\bid=(['"])main-content\1[^>]*\btabindex=(['"])-1\2/i)
  failures << "#{relative}: missing the skip link to main content" unless html.match?(/<a\b[^>]*\bclass=(['"])[^'"]*skip-link[^'"]*\1[^>]*\bhref=(['"])#main-content\2/i)
  if standalone_links_page
    failures << "#{relative}: standalone links page must not render the site header" if html.match?(/<header\b[^>]*\bclass=(['"])[^'"]*\bheader\b[^'"]*\1/i)
    footer_html = html[/<footer\b.*?<\/footer>/mi]
    failures << "#{relative}: standalone links page is missing the site footer" unless footer_html
    failures << "#{relative}: standalone links page footer must use the without-social treatment" unless footer_html&.match?(/\bclass=(['"])[^'"]*\bfooter--without-social\b[^'"]*\1/i)
    failures << "#{relative}: standalone links page footer must not render social icon links" if footer_html&.match?(/\bclass=(['"])[^'"]*\bsocial-icon\b[^'"]*\1/i)
    failures << "#{relative}: standalone links page footer must not link to additional social profiles" if footer_html&.match?(%r{https://(?:www\.)?(?:medium\.com|github\.com|figma\.com|dribbble\.com)/}i)
    failures << "#{relative}: standalone links page footer must link the owner name to LinkedIn" unless footer_html&.match?(%r{<a\b[^>]*\bhref=(['"])https://www\.linkedin\.com/in/jmwii1981/\1[^>]*>Jan Michael Wallace II</a>}i)
    failures << "#{relative}: standalone links page footer is missing its two-line legal and home link group" unless footer_html&.match?(/\bclass=(['"])[^'"]*\blinks-footer-secondary\b[^'"]*\1/i)
    failures << "#{relative}: standalone links page footer is missing its home link" unless footer_html&.match?(/<a\b[^>]*\bhref=(['"])\/\1[^>]*>janmichael\.io<\/a>/i)
  else
    failures << "#{relative}: labeled home logo must hide its decorative SVG" unless html.match?(/<a\b[^>]*\bclass=(['"])[^'"]*logo-container[^'"]*\1[^>]*\baria-label=(['"])Jan Michael Wallace II, home\2[^>]*>\s*<svg\b[^>]*\baria-hidden=(['"])true\3[^>]*\bfocusable=(['"])false\4/i)
    failures << "#{relative}: missing the site footer" unless html.match?(/<footer\b[^>]*\bclass=(['"])[^'"]*\bfooter\b[^'"]*\1/i)
  end

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

layout_source = source_root.join("_layouts", "page.html").read
main_script = source_root.join("scripts", "initializeScripts.js").read
network_script = source_root.join("scripts", "network.mjs").read
search_script = source_root.join("scripts", "search", "initializeSiteSearch.mjs").read
perspectives_fetch_script = source_root.join("scripts", "perspectives", "fetchPost.mjs").read
quality_workflow = source_root.join(".github", "workflows", "quality.yml").read
liquid_gl_license = source_root.join("scripts", "third-party", "liquidGL.LICENSE.txt")
deployed_liquid_gl_license = site_root.join("scripts", "third-party", "liquidGL.LICENSE.txt")
nav_styles = source_root.join("_sass", "includes", "_nav.scss").read
search_styles = source_root.join("_sass", "components", "_site-search.scss").read
logo_styles = source_root.join("_sass", "components", "_logo.scss").read

failures << "page layout: no-js state must not be removed by an inline head script" if layout_source.match?(/classList\.replace\([^\n]*no-js/i)
failures << "page layout: browser entry module is missing its stable discovery marker" unless layout_source.match?(/<script\b[^>]*\bdata-site-entry\b/i)
failures << "initializeScripts.js: module must confirm JavaScript execution before enhancing" unless main_script.match?(/classList\.replace\((['"])no-js\1,\s*(['"])js\2\)/)
failures << "initializeScripts.js: asset version is not derived from the marked browser entry module" unless main_script.include?("document.querySelector('[data-site-entry]')")
failures << "initializeScripts.js: mobile navigation is missing its successful-initialization gate" unless main_script.include?("classList.add('navigation-ready')")
failures << "initializeScripts.js: project gallery controls are missing their per-instance readiness gate" unless main_script.include?("classList.add('is-gallery-ready')")
failures << "initializeScripts.js: one failed enhancement can prevent unrelated initialization" unless main_script.include?("const safelyInitialize =")
failures << "initializeScripts.js: purely visual Web Animations API usage must remain in CSS" if main_script.include?(".animate(")
failures << "initializeScripts.js: obsolete scripted visual initializer remains" if main_script.match?(/initialize(?:LogoAnimation|ScrollReveals)/)
failures << "network: bounded request helper is missing" unless network_script.include?("controller.abort(timeoutError)")
failures << "contact form: submission does not use the bounded JSON request helper" unless main_script.include?("fetchJsonWithTimeout(form.action")
failures << "search: index request does not retry after transient failure" unless search_script.include?("createRetryableRequest(async")
failures << "Perspectives: feed requests do not use the bounded JSON request helper" unless perspectives_fetch_script.scan(/fetchJsonWithTimeout\(/).length >= 2
failures << "quality workflow: network regression tests are missing" unless quality_workflow.include?("node scripts/network.test.mjs")
failures << "quality workflow: Liquid Glass module syntax check is missing" unless quality_workflow.include?('for file in scripts/glass/*.mjs; do node --check "$file"; done')
failures << "quality workflow: vendored Liquid Glass syntax check is missing" unless quality_workflow.include?("node --input-type=module --check < scripts/third-party/liquidGL.js")
failures << "vendored Liquid Glass license is missing" unless liquid_gl_license.file? && liquid_gl_license.read.start_with?("MIT License")
failures << "generated site: vendored Liquid Glass license is missing" unless deployed_liquid_gl_license.file? && deployed_liquid_gl_license.read.start_with?("MIT License")
failures << "logo: CSS path animation must be feature-gated behind @supports" unless logo_styles.match?(/@supports\s*\(d:\s*path\(/)
failures << "navigation: optional indicator initializer is missing" unless main_script.include?("const initializeNavIndicator =")
failures << "navigation: enhanced indicator is not readiness-gated" unless main_script.include?("classList.add('is-indicator-ready')")
failures << "navigation: indicator markup is missing" unless source_root.join("_includes", "nav.html").read.match?(/class=(['"])nav-indicator\1[^>]*aria-hidden=(['"])true\2/)
failures << "navigation: CSS active-state fallback is missing" unless nav_styles.match?(/&\.active::after\s*\{\s*transform:\s*scaleX\(1\)/m)
failures << "navigation: CSS hover/focus fallback is missing" unless nav_styles.include?("&:hover::after") && nav_styles.include?("&:focus-visible::after")
failures << "navigation: enhanced indicator must only replace the fallback after readiness" unless nav_styles.match?(/\.nav-container\.is-indicator-ready\s*\{.*?\.tab::after/m)
failures << "site search: control is missing its successful-initialization gate" unless search_script.include?("classList.add('is-ready')")
failures << "site search: control must be hidden before its enhancement is ready" unless search_styles.match?(/\.site-search\s*\{.*?display:\s*none;/m)
failures << "site search: ready control is not revealed" unless search_styles.match?(/\.site-search\.is-ready\s*\{.*?display:\s*flex;/m)
failures << "navigation: static fallback is missing when enhancement initialization fails" unless nav_styles.include?(".html:not(.navigation-ready) .nav")

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

terms = site_root.join("terms", "index.html")
if terms.file?
  html = terms.read
  required_legal_sections = {
    "ownership-of-site-materials" => "Ownership of Site Materials",
    "professional-work-and-contributions" => "Professional Work and Contributions",
    "third-party-names-marks-and-materials" => "Third-Party Names, Marks, and Materials",
    "portfolio-confidentiality-and-representative-material" => "Portfolio Confidentiality and Representative Material",
    "testimonials-and-professional-statements" => "Testimonials and Professional Statements",
    "rights-and-confidentiality-requests" => "Rights and Confidentiality Requests"
  }

  required_legal_sections.each do |id, heading|
    failures << "terms/index.html: missing legal section ##{id}" unless html.match?(/<section\b[^>]*\bid=(['"])#{Regexp.escape(id)}\1/i)
    failures << "terms/index.html: missing legal heading #{heading.inspect}" unless html.include?(">#{heading}</h3>")
  end

  failures << "terms/index.html: third-party ownership attribution is missing" unless html.include?("property of their respective owners")
  failures << "terms/index.html: endorsement and current-affiliation disclaimer is missing" unless html.include?("does not imply sponsorship, endorsement, approval, partnership, or current affiliation")
  failures << "terms/index.html: project-role attribution boundary is missing" unless html.include?("do not claim sole authorship, ownership, or responsibility")
  failures << "terms/index.html: explicit NDA preservation language is missing" unless html.include?("non-disclosure agreement (NDA)") && html.include?("the agreement controls")
  failures << "terms/index.html: rights and confidentiality contact is missing" unless html.match?(/<section\b[^>]*\bid=(['"])rights-and-confidentiality-requests\1.*?mailto:hello@janmichael\.io.*?<\/section>/mi)
else
  failures << "terms/index.html: missing from build output"
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
  failures << "sitemap.xml: preferred profile portrait is missing" unless contents.include?("https://janmichael.io/images/headshots/bio-pic.png")
  failures << "sitemap.xml: four-by-three profile portrait is missing" unless contents.include?("https://janmichael.io/images/headshots/jan-michael-wallace-ii-profile-4x3.png")
  failures << "sitemap.xml: sixteen-by-nine profile portrait is missing" unless contents.include?("https://janmichael.io/images/headshots/jan-michael-wallace-ii-profile-16x9.png")
else
  failures << "sitemap.xml: missing from build output"
end

search_index = site_root.join("search-index.json")
if search_index.file?
  begin
    payload = JSON.parse(search_index.read)
    records = payload["records"]

    if payload["version"] != 1
      failures << "search-index.json: unsupported or missing version"
    end

    unless records.is_a?(Array) && records.length >= 5
      failures << "search-index.json: expected records for every public page"
      records = []
    end

    duplicate_record_ids = records.filter_map { |record| record["id"] }.tally.select { |_, count| count > 1 }.keys
    duplicate_record_ids.each do |id|
      failures << "search-index.json: duplicate record id #{id.inspect}"
    end

    records.each_with_index do |record, index|
      %w[id title url category summary content keywords priority].each do |field|
        failures << "search-index.json: record #{index} is missing #{field}" unless record.key?(field)
      end

      url = record["url"].to_s
      unless url.start_with?("/")
        failures << "search-index.json: record #{index} must use an internal URL"
        next
      end

      path, anchor = url.split("#", 2)
      destination = site_root.join(path.delete_prefix("/"))
      destination = destination.join("index.html") if path.end_with?("/")

      unless destination.file?
        failures << "search-index.json: record #{index} points to missing page #{url}"
        next
      end

      if anchor && !destination.read.match?(/\bid=(['"])#{Regexp.escape(anchor)}\1/i)
        failures << "search-index.json: record #{index} points to missing anchor #{url}"
      end
    end
  rescue JSON::ParserError => error
    failures << "search-index.json: invalid JSON (#{error.message})"
  end
else
  failures << "search-index.json: missing from build output"
end

home = site_root.join("index.html")
if home.file?
  html = home.read
  preferred_portrait = "https://janmichael.io/images/headshots/bio-pic.png"
  supporting_portraits = [
    "https://janmichael.io/images/headshots/jan-michael-wallace-ii-profile-4x3.png",
    "https://janmichael.io/images/headshots/jan-michael-wallace-ii-profile-16x9.png"
  ]
  failures << "index.html: preferred portrait is missing from Open Graph metadata" unless html.match?(/<meta\b[^>]*property=(['"])og:image\1[^>]*content=(['"])#{Regexp.escape(preferred_portrait)}\2/i)
  failures << "index.html: preferred portrait is missing from Twitter metadata" unless html.match?(/<meta\b[^>]*name=(['"])twitter:image\1[^>]*content=(['"])#{Regexp.escape(preferred_portrait)}\2/i)
  failures << "index.html: large image previews are not enabled" unless html.match?(/<meta\b[^>]*name=(['"])robots\1[^>]*content=(['"])[^'"]*max-image-preview:large[^'"]*\2/i)

  structured_data = html.scan(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>(.*?)<\/script>/mi).map { |(_, json)| JSON.parse(json) }
  graph = structured_data.flat_map { |document| document.fetch("@graph", []) }
  person = graph.find { |node| node["@type"] == "Person" }
  image = graph.find { |node| node["@type"] == "ImageObject" && node["contentUrl"] == preferred_portrait }
  profile_page = graph.find { |node| node["@type"] == "ProfilePage" }
  person_image_ids = Array(person&.fetch("image", nil)).filter_map { |entry| entry.is_a?(Hash) ? entry["@id"] : nil }
  failures << "index.html: Person schema does not reference the preferred portrait first" unless person_image_ids.first == "https://janmichael.io/#profile-image"
  failures << "index.html: Person schema does not reference all three portrait ratios" unless person_image_ids == [
    "https://janmichael.io/#profile-image",
    "https://janmichael.io/#profile-image-4x3",
    "https://janmichael.io/#profile-image-16x9"
  ]
  failures << "index.html: preferred portrait ImageObject is missing" unless image
  supporting_portraits.each do |portrait|
    failures << "index.html: supporting portrait ImageObject is missing (#{portrait})" unless graph.any? { |node| node["@type"] == "ImageObject" && node["contentUrl"] == portrait }
  end
  failures << "index.html: Person schema is missing the stable identity handle" unless person&.dig("identifier") == "jmwii1981"
  failures << "index.html: Person schema must not expose search-profile data" if person&.key?("skills") || person&.key?("birthDate") || person&.key?("telephone") || person&.key?("homeLocation")
  failures << "index.html: Person schema is missing the Dribbble profile" unless person&.fetch("sameAs", [])&.include?("https://dribbble.com/jmwii1981")
  failures << "index.html: Person schema is missing the Figma profile" unless person&.fetch("sameAs", [])&.include?("https://www.figma.com/@jmwii1981")
  failures << "index.html: Person schema is not linked back to the ProfilePage" unless person&.dig("mainEntityOfPage", "@id") == "https://janmichael.io/#webpage"
  failures << "index.html: ProfilePage schema needs an ISO 8601 dateModified timestamp" unless valid_structured_data_datetime?(profile_page&.fetch("dateModified", nil))
  failures << "index.html: ProfilePage schema does not declare the preferred portrait" unless profile_page&.dig("primaryImageOfPage", "@id") == "https://janmichael.io/#profile-image"
else
  failures << "index.html: missing from build output"
end

project_pages = vitae_projects.to_h do |slug, project|
  [slug, Pathname.new(project.fetch("cover")).dirname.basename.to_s]
end
vitae_page_html = site_root.join("vitae", "index.html").read
sitemap_html = site_root.join("sitemap.xml").read
vitae_structured_data = vitae_page_html.scan(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>(.*?)<\/script>/mi).map { |(_, json)| JSON.parse(json) }
vitae_graph = vitae_structured_data.flat_map { |document| document.fetch("@graph", []) }
project_item_list = vitae_graph.find { |node| node["@type"] == "ItemList" && node["@id"] == "https://janmichael.io/vitae/#vitae-projects" }
actual_project_items = Array(project_item_list&.fetch("itemListElement", nil)).map do |entry|
  item = entry.fetch("item", {})
  {
    "position" => entry["position"],
    "url" => item["url"],
    "name" => item["name"],
    "headline" => item["headline"],
    "description" => item["description"]
  }
end
expected_project_items = vitae_projects.map.with_index do |(slug, project), index|
  {
    "position" => index + 1,
    "url" => "https://janmichael.io/vitae/#{slug}/",
    "name" => project.fetch("name"),
    "headline" => project.fetch("headline"),
    "description" => project.fetch("introduction")
  }
end
failures << "vitae/index.html: project ItemList does not match _data/vitae_projects.yml" unless actual_project_items == expected_project_items

project_pages.each do |slug, image_folder|
  relative = "vitae/#{slug}/index.html"
  file = site_root.join(relative)

  unless file.file?
    failures << "#{relative}: focused project page is missing"
    next
  end

  html = file.read
  canonical = "https://janmichael.io/vitae/#{slug}/"
  failures << "#{relative}: canonical URL is missing or incorrect" unless html.match?(/<link\b[^>]*rel=(['"])canonical\1[^>]*href=(['"])#{Regexp.escape(canonical)}\2/i)
  failures << "#{relative}: Open Graph type must be article" unless html.match?(/<meta\b[^>]*property=(['"])og:type\1[^>]*content=(['"])article\2/i)
  failures << "#{relative}: project social image is missing" unless html.match?(/<meta\b[^>]*property=(['"])og:image\1[^>]*content=(['"])[^'"]*\/images\/projects\/#{Regexp.escape(image_folder)}\//i)
  failures << "#{relative}: Vitae navigation is not current" unless html.match?(/<a\b[^>]*id=(['"])vitae\1[^>]*class=(['"])[^'"]*\bactive\b[^'"]*\2[^>]*aria-current=(['"])page\3/i)
  failures << "vitae/index.html: missing visible link to #{canonical}" unless vitae_page_html.include?("href=\"/vitae/#{slug}/\"")
  failures << "sitemap.xml: missing focused project URL #{canonical}" unless sitemap_html.include?("<loc>#{canonical}</loc>")

  structured_data = html.scan(/<script\b[^>]*type=(['"])application\/ld\+json\1[^>]*>(.*?)<\/script>/mi).map { |(_, json)| JSON.parse(json) }
  graph = structured_data.flat_map { |document| document.fetch("@graph", []) }
  web_page = graph.find { |node| node["@type"] == "WebPage" }
  creative_work = graph.find { |node| node["@type"] == "CreativeWork" }
  breadcrumb = graph.find { |node| node["@type"] == "BreadcrumbList" }
  failures << "#{relative}: CreativeWork structured data is missing" unless creative_work
  failures << "#{relative}: breadcrumb structured data is missing" unless breadcrumb
  failures << "#{relative}: WebPage schema needs an ISO 8601 dateModified timestamp" unless valid_structured_data_datetime?(web_page&.fetch("dateModified", nil))
  failures << "#{relative}: WebPage does not identify the CreativeWork as its main entity" unless web_page&.dig("mainEntity", "@id") == "#{canonical}#creative-work"
  failures << "#{relative}: CreativeWork is not linked to Jan Michael Wallace II" unless creative_work&.dig("creator", "@id") == "https://janmichael.io/#person"
end

legacy_redirects.each do |relative, redirect|
  file = site_root.join(relative)

  unless file.file?
    failures << "#{relative}: legacy redirect page is missing"
    next
  end

  html = file.read
  target = redirect.fetch(:target)
  canonical = redirect.fetch(:canonical)
  failures << "#{relative}: redirect target is incorrect" unless html.include?("content=\"0; url=#{target}\"")
  failures << "#{relative}: JavaScript redirect fallback is incorrect" unless html.include?("window.location.replace(#{target.to_json})")
  failures << "#{relative}: canonical target is incorrect" unless html.include?("rel=\"canonical\" href=\"#{canonical}\"")
  failures << "#{relative}: accessible redirect link is missing" unless html.include?("href=\"#{target}\"")
end

if failures.any?
  warn failures.join("\n")
  exit 1
end

puts "Site audit passed: progressive enhancement, structure, ARIA references, image delivery, contact fallback, metadata, static search, external-link safety, JSON-LD/XML, and sitemap checks."
