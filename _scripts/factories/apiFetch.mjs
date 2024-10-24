const apiFetchFactory = async function(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const apiData = await response.json();
        const apiHeaders = await Object.fromEntries(response.headers.entries());
        if (response.headers.entries()) {
            return {
                apiData,
                apiHeaders,
            }
        } else {
            return {
                apiData,
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
}
export { apiFetchFactory };