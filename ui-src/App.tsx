import React, { useEffect, useState } from "react";
import * as loom from "@loomhq/loom-embed";

import "./App.css";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type OInterface = Awaited<ReturnType<typeof loom.oembed>>;

function App() {
  const [showiFrame, setShowiFrame] = useState(false);
  const [url, setUrl] = useState<string | undefined>();
  const [oembed, setOembed] = useState<OInterface | undefined>();

  useEffect(() => {
    window.onmessage = (ev) => {
      if (typeof ev.data !== "object" || !("pluginMessage" in ev.data)) return;

      if (ev.data.pluginMessage.type === "addEmbedUrl") {
        setShowiFrame(false);
      } else if (ev.data.pluginMessage.type === "playEmbedUrl") {
        setShowiFrame(true);
        setOembed(ev.data.pluginMessage.payload);
      }
    };
  }, []);

  async function submitUrl() {
    if (!url) return;

    // Show some error message on a wrong url

    const oembed: OInterface = await loom.oembed(url);

    parent.postMessage(
      {
        pluginMessage: {
          type: "oembedData",
          payload: {
            ...oembed,
          },
        },
      },
      "*"
    );
  }

  return (
    <div className="App">
      {showiFrame ? (
        oembed && <div dangerouslySetInnerHTML={{ __html: oembed?.html }}></div>
      ) : (
        <div>
          <label>Enter Loom URL:</label>
          <input type="url" onChange={(e) => setUrl(e.target.value)} />

          <button onClick={submitUrl}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App;
