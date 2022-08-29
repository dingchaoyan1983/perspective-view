import React, { useRef, useEffect, useState } from "react";

import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/dist/umd/all-themes.css";

const worker = perspective.shared_worker();

const dataUrls = [
  { url: "./api/superstore.arrow" },
  { url: "./api/date64.arrow" }
];

export function Perspective() {
  const viewerRef = useRef();

  const [selectedDataUrl, setSelectedDataUrl] = useState(dataUrls[0]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const { url, config = {} } = selectedDataUrl;

      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      if (ignore) {
        return;
      }

      const table = worker.table(buffer);

      await viewerRef.current.load(table);
      await viewerRef.current.restore(config);
    }

    load();

    return () => {
      ignore = true;
    };
  }, [selectedDataUrl]);

  return (
    <>
      <select
        onChange={event => setSelectedDataUrl(dataUrls[event.target.value])}
      >
        {dataUrls.map(({ url }, index) => (
          <option key={url} value={index}>
            {url}
          </option>
        ))}
      </select>
      <div className="PerspectiveViewer">
        <perspective-viewer ref={viewerRef} />
      </div>
    </>
  );
}

export default Perspective;
