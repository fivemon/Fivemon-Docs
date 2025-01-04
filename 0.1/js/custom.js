const processLinksAndImages = () => {
    const currentBase = window.location.origin;
    const currentPath = window.location.pathname;
    const versionRegex = /^\/([^\/]+)\//;
    const match = currentPath.match(versionRegex);

    if (!match) {
    return;
    }

    const currentVersion = match[1];

    const links = document.querySelectorAll("a[href], img[src]");

    const promises = [];

    links.forEach((link) => {
    const attr = link.tagName === "IMG" ? "src" : "href";
    const url = link.getAttribute(attr);

    if (/^(https?:|mailto:|#|\/\/.+)/.test(url)) {
        if (!url.startsWith(currentBase)) return;
        if (url.startsWith(`${currentBase}/${currentVersion}/`)) return;
    } else {
        if (url.startsWith(`/${currentVersion}/`)) return;
    }

    let newUrl;
    if (url.startsWith("/")) {
        newUrl = `/${currentVersion}${url}`;
    } else {
        newUrl = `${currentBase}/${currentVersion}${url.replace(currentBase, "")}`;
    }

    promises.push(
        new Promise(() => {
        fetch(newUrl);
        link.setAttribute(attr, newUrl)
        })
    )
    });

    Promise.all(promises)
};

if (document.readyState === "loading") {
    document.addEventListener("readystatechange", () => {
    if (document.readyState === "interactive") {
        processLinksAndImages();
    }
    });
} else {
    processLinksAndImages();
}