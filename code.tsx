const { widget, ui } = figma;
const {
  AutoLayout,
  Text: WidgetText,
  useEffect,
  useSyncedState,
  Image: WidgetImage,
} = widget;

interface OEmbedData {
  type: "video";
  html: string;
  title: string;
  height: number | null;
  width: number | null;
  provider_name: "Loom";
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  duration: number;
}

function Widget() {
  const [oembedData, setOembedData] = useSyncedState<OEmbedData>(
    "oembedData",
    undefined
  );

  useEffect(() => {
    figma.ui.on("message", ({ type, payload }) => {
      if (type === "oembedData") {
        setOembedData(payload);
        figma.ui.close();
      }
    });
  });

  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={8}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
      onClick={async () => {
        await new Promise<void>((resolve) => {
          figma.showUI(
            __html__,
            oembedData && {
              width: oembedData.width / 2,
              height: oembedData.height / 2,
            }
          );

          if (oembedData) {
            figma.ui.postMessage({
              type: "playEmbedUrl",
              payload: { ...oembedData },
            });
          } else {
            figma.ui.postMessage({ type: "addEmbedUrl" });
          }

          figma.ui.on("message", (msg) => {
            if (msg === "close") {
              figma.closePlugin();
            }
          });
        });
      }}
    >
      {oembedData ? (
        <WidgetImage
          src={oembedData.thumbnail_url}
          width={oembedData.thumbnail_width}
          height={oembedData.thumbnail_height}
        ></WidgetImage>
      ) : (
        <WidgetText fontSize={32} horizontalAlignText="center">
          Click to add Loom Embed
        </WidgetText>
      )}
    </AutoLayout>
  );
}
widget.register(Widget);
