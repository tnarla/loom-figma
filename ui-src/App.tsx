import React, { useEffect, useState } from "react";
import * as loom from "@loomhq/loom-embed";

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
    <div className="p-4">
      {showiFrame ? (
        oembed && <div dangerouslySetInnerHTML={{ __html: oembed?.html }}></div>
      ) : (
        <div className="flex flex-col items-start">
          <label className="block text-sm font-medium text-gray-700 w-full">
            Enter Loom share URL:
            <input
              type="url"
              required
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <div className="mt-1"></div>

          <button
            className="bg-[#615CF5] rounded py-2 px-3 text-white"
            onClick={submitUrl}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
