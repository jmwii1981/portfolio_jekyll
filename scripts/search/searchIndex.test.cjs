const assert = require('assert').strict;
const { readFileSync } = require('fs');
const { join } = require('path');

(async () => {
    const { rankSearchRecords } = await import('./initializeSiteSearch.mjs');
    const payload = JSON.parse(readFileSync(join(__dirname, '..', '..', 'search-index.json'), 'utf8'));
    const { records } = payload;

    const expectedRecordIds = [
        'profile:jan-michael-wallace-ii',
        'page:/',
        'page:/work/',
        'page:/perspectives/',
        'page:/contact/',
        'page:/terms/',
        'section:/#about',
        'section:/#how-i-help',
        'section:/#recommendations',
        'section:/#beyond-the-work',
        'section:/work/#selected-work',
        'section:/work/#project-lionfinancial',
        'section:/work/#project-vega',
        'section:/work/#project-avenapay',
        'section:/work/#project-paladin',
        'section:/work/#project-ledgerflow',
        'section:/work/#project-northstar',
        'section:/work/#design-leadership-principles',
        'section:/perspectives/#latest-perspectives',
        'section:/perspectives/#read-more-on-medium',
        'section:/contact/#contact-jan',
        'section:/terms/#effective-date',
        'section:/terms/#purpose-of-this-site',
        'section:/terms/#information-used-by-this-site',
        'section:/terms/#analytics-and-third-party-services',
        'section:/terms/#how-information-is-used',
        'section:/terms/#your-choices',
        'section:/terms/#content-and-intellectual-property',
        'section:/terms/#external-links',
        'section:/terms/#no-warranty',
        'section:/terms/#changes-to-these-terms',
        'section:/terms/#privacy-contact'
    ];

    assert.equal(payload.version, 1);
    assert.equal(records.length, expectedRecordIds.length);
    assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
    assert.equal(new Set(records.filter(({ id }) => id !== 'profile:jan-michael-wallace-ii').map(({ url }) => url)).size, records.length - 1);

    expectedRecordIds.forEach((id) => {
        assert(records.some((record) => record.id === id), `Missing expected search record: ${id}`);
    });

    records.forEach((record) => {
        ['id', 'title', 'url', 'category', 'summary', 'content', 'keywords'].forEach((field) => {
            assert.equal(typeof record[field], 'string', `${record.id} has an invalid ${field}`);
        });
        assert(record.title.length > 0, `${record.id} has no title`);
        assert(record.content.length > 0, `${record.id} has no searchable content`);
        assert(record.url.startsWith('/'), `${record.id} has a non-local URL`);
        assert.equal(typeof record.priority, 'number', `${record.id} has an invalid priority`);
    });

    const expectTopResult = (query, expectedId) => {
        const [topResult] = rankSearchRecords(records, query);
        assert.equal(topResult?.id, expectedId, `Unexpected top result for ${JSON.stringify(query)}`);
    };

    expectTopResult('design systems', 'section:/work/#project-vega');
    expectTopResult('probability scoring', 'section:/work/#project-avenapay');
    expectTopResult('report-preparation time', 'section:/work/#project-lionfinancial');
    expectTopResult('invoice creation', 'section:/work/#project-ledgerflow');
    expectTopResult('wireframing accessibility', 'section:/work/#project-paladin');
    expectTopResult('payment products rates', 'section:/work/#project-northstar');
    expectTopResult('great cup coffee', 'section:/#beyond-the-work');
    expectTopResult('Global Payments', 'section:/#recommendations');
    expectTopResult('jmwii1981', 'profile:jan-michael-wallace-ii');

    const web3FormsResults = rankSearchRecords(records, 'Web3Forms').map(({ id }) => id);
    assert(web3FormsResults.includes('section:/terms/#information-used-by-this-site'));
    assert(web3FormsResults.includes('section:/terms/#analytics-and-third-party-services'));

    assert.equal(rankSearchRecords(records, 'zzzznomatch').length, 0);

    console.log(`Search index tests passed: ${records.length} records and 10 representative queries.`);
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
